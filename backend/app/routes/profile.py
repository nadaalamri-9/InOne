import os
import uuid
import secrets
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import (
    StudentProfile, ProfileSkill, ProfileTargetRole,
    ProfileEducation, ProfileCertification, ProfileSocialLinks,
)
from ..schemas.profile import (
    ProfileUpdateRequest, ProfileResponse, SocialLinksItem,
    ShareSettingsResponse, VisibilityUpdateRequest,
)
from ..auth.dependencies import get_current_user

router = APIRouter(tags=["profile"])

UPLOAD_BASE = Path(__file__).parent.parent / "uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_RESUME_TYPES = {"application/pdf"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB
MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10 MB


def get_or_create_profile(db: Session, user: User) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        import string
        suffix = "".join(secrets.choice(string.digits) for _ in range(4))
        slug = f"{user.first_name}-{user.last_name}-{suffix}".lower()
        profile = StudentProfile(
            user_id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            portfolio_slug=slug,
            share_token=secrets.token_urlsafe(16),
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def serialize_profile(profile: StudentProfile, base_url: str = "http://127.0.0.1:8000") -> dict:
    social = profile.social_links
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name or "",
        "last_name": profile.last_name or "",
        "role": profile.role or "",
        "headline": profile.headline or "",
        "bio": profile.bio or "",
        "about_me": profile.about_me or "",
        "location": profile.location or "",
        "email": profile.email or "",
        "phone": profile.phone or "",
        "photo_url": profile.photo_url or "",
        "resume_url": profile.resume_url or "",
        "resume_name": profile.resume_name or "",
        "portfolio_slug": profile.portfolio_slug,
        "share_token": profile.share_token,
        "visibility": profile.visibility.value if profile.visibility else "private",
        "review_status": profile.review_status.value if profile.review_status else "draft",
        "skills": [{"id": s.id, "name": s.name} for s in profile.skills],
        "target_roles": [{"id": t.id, "name": t.name} for t in profile.target_roles],
        "education": [{"id": e.id, "degree": e.degree, "school": e.school, "year": e.year} for e in profile.education],
        "certifications": [{"id": c.id, "name": c.name, "year": c.year} for c in profile.certifications],
        "social_links": {
            "linkedin": social.linkedin if social else "",
            "github": social.github if social else "",
            "website": social.website if social else "",
        },
        "created_at": profile.created_at.isoformat() if profile.created_at else None,
        "updated_at": profile.updated_at.isoformat() if profile.updated_at else None,
    }


@router.get("/users/search-by-email")
def search_user_by_email(
    email: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clean_email = email.strip().lower()
    if not clean_email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot add yourself")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    return {
        # Integer primary key — required for the team-member foreign key.
        "userId": user.id,
        "name": f"{user.first_name} {user.last_name}".strip(),
        "email": user.email,
        "photoUrl": profile.photo_url if profile else "",
        "role": user.role.value if user.role else "student",
    }


@router.get("/profile/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(db, current_user)
    return serialize_profile(profile)


@router.put("/profile/me")
def update_my_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(db, current_user)

    # Scalar fields
    scalar_fields = [
        "first_name", "last_name", "role", "headline", "bio",
        "about_me", "location", "email", "phone",
        "portfolio_slug", "visibility", "review_status",
    ]
    for field in scalar_fields:
        value = getattr(payload, field, None)
        if value is not None:
            if field == "visibility":
                from ..models.profile import VisibilityEnum
                try:
                    setattr(profile, field, VisibilityEnum(value))
                except ValueError:
                    pass
            elif field == "review_status":
                from ..models.profile import ReviewStatusEnum
                try:
                    setattr(profile, field, ReviewStatusEnum(value))
                except ValueError:
                    pass
            else:
                setattr(profile, field, value)

    # Skills
    if payload.skills is not None:
        db.query(ProfileSkill).filter(ProfileSkill.profile_id == profile.id).delete()
        for item in payload.skills:
            if item.name.strip():
                db.add(ProfileSkill(profile_id=profile.id, name=item.name.strip()))

    # Target roles
    if payload.target_roles is not None:
        db.query(ProfileTargetRole).filter(ProfileTargetRole.profile_id == profile.id).delete()
        for item in payload.target_roles:
            if item.name.strip():
                db.add(ProfileTargetRole(profile_id=profile.id, name=item.name.strip()))

    # Education
    if payload.education is not None:
        db.query(ProfileEducation).filter(ProfileEducation.profile_id == profile.id).delete()
        for item in payload.education:
            if item.school.strip() or item.degree.strip():
                db.add(ProfileEducation(
                    profile_id=profile.id,
                    degree=item.degree,
                    school=item.school,
                    year=item.year,
                ))

    # Certifications
    if payload.certifications is not None:
        db.query(ProfileCertification).filter(ProfileCertification.profile_id == profile.id).delete()
        for item in payload.certifications:
            if item.name.strip():
                db.add(ProfileCertification(profile_id=profile.id, name=item.name, year=item.year))

    # Social links
    if payload.social_links is not None:
        existing = db.query(ProfileSocialLinks).filter(ProfileSocialLinks.profile_id == profile.id).first()
        if existing:
            existing.linkedin = payload.social_links.linkedin
            existing.github = payload.social_links.github
            existing.website = payload.social_links.website
        else:
            db.add(ProfileSocialLinks(
                profile_id=profile.id,
                linkedin=payload.social_links.linkedin,
                github=payload.social_links.github,
                website=payload.social_links.website,
            ))

    db.commit()
    db.refresh(profile)
    return serialize_profile(profile)


@router.post("/profile/photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image must be under 5MB")

    folder = UPLOAD_BASE / "profile_pictures"
    folder.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = folder / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    photo_url = f"/uploads/profile_pictures/{filename}"

    profile = get_or_create_profile(db, current_user)
    profile.photo_url = photo_url
    db.commit()

    return {"photo_url": photo_url}


@router.delete("/profile/photo")
def delete_photo(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(db, current_user)
    if profile.photo_url:
        file_path = UPLOAD_BASE / profile.photo_url.replace("/uploads/", "", 1).lstrip("/")
        if file_path.exists():
            file_path.unlink(missing_ok=True)
    profile.photo_url = ""
    db.commit()
    return {"detail": "Photo deleted"}


@router.post("/profile/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_RESUME_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()
    if len(contents) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume must be under 10MB")

    folder = UPLOAD_BASE / "resumes"
    folder.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix or ".pdf"
    filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = folder / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    resume_url = f"/uploads/resumes/{filename}"
    resume_name = file.filename or filename

    profile = get_or_create_profile(db, current_user)
    profile.resume_url = resume_url
    profile.resume_name = resume_name
    db.commit()

    return {"resume_url": resume_url, "resume_name": resume_name}


@router.delete("/profile/resume")
def delete_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(db, current_user)
    if profile.resume_url:
        file_path = UPLOAD_BASE / profile.resume_url.replace("/uploads/", "", 1).lstrip("/")
        if file_path.exists():
            file_path.unlink(missing_ok=True)
    profile.resume_url = ""
    profile.resume_name = ""
    db.commit()
    return {"detail": "Resume deleted"}
