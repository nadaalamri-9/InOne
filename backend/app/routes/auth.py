from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import StudentProfile, VisibilityEnum
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, ForgotPasswordRequest, UpdateMeRequest, ChangePasswordRequest
from ..auth.dependencies import hash_password, verify_password, create_access_token, get_current_user
import secrets
import string

router = APIRouter(prefix="/auth", tags=["auth"])

ROLE_MAP = {
    "S": "student", "s": "student",
    "C": "coach", "c": "coach",
    "E": "employer", "e": "employer",
    "A": "admin", "a": "admin",
}


def parse_role_from_user_id(user_id_string: str) -> str:
    if not user_id_string:
        return "student"
    first_char = user_id_string.strip()[0].upper()
    return ROLE_MAP.get(first_char, "student")


def generate_slug(first_name: str, last_name: str) -> str:
    base = f"{first_name}-{last_name}".lower().replace(" ", "-")
    suffix = "".join(secrets.choice(string.digits) for _ in range(4))
    return f"{base}-{suffix}"


def build_user_response(user: User, db: Session) -> dict:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    photo_url = profile.photo_url if profile else ""
    return {
        "id": user.id,
        "user_id_string": user.user_id_string,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role.value if user.role else "student",
        "is_active": user.is_active,
        "created_at": user.created_at,
        "photo_url": photo_url,
        "photoUrl": photo_url,
        "location": profile.location if profile else "",
        "phone": profile.phone if profile else "",
    }


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.user_id_string and db.query(User).filter(User.user_id_string == payload.user_id_string).first():
        raise HTTPException(status_code=400, detail="This ID is already registered")

    # Determine role: prefer explicit role, fall back to parsing user_id_string
    role_str = payload.role
    if payload.user_id_string:
        parsed = parse_role_from_user_id(payload.user_id_string)
        if parsed:
            role_str = parsed

    try:
        role_enum = UserRole(role_str)
    except ValueError:
        role_enum = UserRole.student

    user = User(
        user_id_string=payload.user_id_string,
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.password),
        role=role_enum,
    )
    db.add(user)
    db.flush()

    # Auto-create a profile for every role so photos, phone, city, and title
    # are stored once and visible across Admin, Coach, Employer, and Home.
    slug = generate_slug(payload.first_name, payload.last_name)
    profile = StudentProfile(
        user_id=user.id,
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        email=payload.email.lower().strip(),
        portfolio_slug=slug,
        share_token=secrets.token_urlsafe(16),
        visibility=VisibilityEnum.public if role_enum == UserRole.student else VisibilityEnum.private,
    )
    db.add(profile)

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=build_user_response(user, db))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=build_user_response(user, db))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return build_user_response(current_user, db)


@router.patch("/me", response_model=UserResponse)
def update_me(payload: UpdateMeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.first_name:
        current_user.first_name = payload.first_name.strip()
    if payload.last_name is not None:
        current_user.last_name = payload.last_name.strip()
    if payload.email:
        new_email = str(payload.email).strip().lower()
        existing = db.query(User).filter(User.email == new_email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = new_email
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.first_name = current_user.first_name
        profile.last_name = current_user.last_name
        profile.email = current_user.email

    db.commit()
    db.refresh(current_user)
    return build_user_response(current_user, db)


@router.post("/change-password")
def change_password(payload: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    if payload.old_password and not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Placeholder — always returns success to avoid user enumeration
    return {"message": "If that email exists, a reset link has been sent."}
