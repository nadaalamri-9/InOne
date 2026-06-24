from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import StudentProfile
from ..models.project import Project, ProjectStatus
from ..routes.projects import serialize_project
from ..auth.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


class RoleUpdateRequest(BaseModel):
    role: str


class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    location: Optional[str] = None
    title: Optional[str] = None
    headline: Optional[str] = None


def _user_row(user: User, db: Session) -> dict:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    projects = db.query(Project).filter(Project.owner_id == user.id).all()
    status = "Active" if user.is_active else "Inactive"
    return {
        "id": user.id,
        "user_id_string": user.user_id_string,
        "name": f"{user.first_name} {user.last_name}".strip(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "status": status,
        "photo_url": profile.photo_url if profile else "",
        "photoUrl": profile.photo_url if profile else "",
        "avatar": profile.photo_url if profile else "",
        "location": profile.location if profile else "",
        "city": profile.location if profile else "",
        "phone": profile.phone if profile else "",
        "title": profile.headline or profile.role if profile else "",
        "headline": profile.headline if profile else "",
        "project_count": len(projects),
        "ready_count": sum(1 for p in projects if p.status == ProjectStatus.ready),
        "published_count": sum(1 for p in projects if p.status == ProjectStatus.published),
        "needs_revision_count": sum(1 for p in projects if p.status == ProjectStatus.needs_revision),
        "created_at": user.created_at.isoformat() if user.created_at else "",
    }


@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    projects = db.query(Project).all()

    role_counts = {
        "students": sum(1 for u in users if u.role == UserRole.student),
        "coaches": sum(1 for u in users if u.role == UserRole.coach),
        "employers": sum(1 for u in users if u.role == UserRole.employer),
        "admins": sum(1 for u in users if u.role == UserRole.admin),
    }
    total = sum(role_counts.values())

    published_projects = [p for p in projects if p.status == ProjectStatus.published]

    return {
        "stats": {
            **role_counts,
            "portfolios": len(published_projects),
            "total_users": total,
        },
        "role_counts": role_counts,
        "users": [_user_row(u, db) for u in users[:20]],
        "projects": [serialize_project(p) for p in published_projects[:10]],
    }


# Alias the admin dashboard at /dashboard/analytics for the existing frontend call
@router.get("/dashboard/analytics")
def admin_dashboard_analytics(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return admin_dashboard(current_user=current_user, db=db)


@router.get("/users")
def list_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [_user_row(u, db) for u in users]


@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return _user_row(user, db)


@router.patch("/users/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdateRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.first_name:
        user.first_name = payload.first_name.strip()
    if payload.last_name is not None:
        user.last_name = payload.last_name.strip()
    if payload.email:
        new_email = payload.email.strip().lower()
        existing = db.query(User).filter(User.email == new_email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = new_email
    if payload.role:
        try:
            user.role = UserRole(payload.role.lower())
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {payload.role}")
    if payload.is_active is not None:
        user.is_active = payload.is_active

    # Keep the role-specific profile in sync so Admin Users, dashboards,
    # coach/employer pages, and portfolio cards all show the same details.
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        profile = StudentProfile(
            user_id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
        )
        db.add(profile)
        db.flush()

    profile.first_name = user.first_name
    profile.last_name = user.last_name
    profile.email = user.email

    if payload.location is not None or payload.city is not None:
        profile.location = (payload.location if payload.location is not None else payload.city or "").strip()
    if payload.phone is not None:
        profile.phone = payload.phone.strip()
    if payload.headline is not None or payload.title is not None:
        profile.headline = (payload.headline if payload.headline is not None else payload.title or "").strip()

    db.commit()
    db.refresh(user)
    return _user_row(user, db)


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: RoleUpdateRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        user.role = UserRole(payload.role)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {payload.role}")

    db.commit()
    db.refresh(user)
    return _user_row(user, db)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()


@router.get("/portfolios")
def list_portfolios(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    profiles = db.query(StudentProfile).all()
    result = []
    for profile in profiles:
        owner = db.query(User).filter(User.id == profile.user_id).first()
        projects = db.query(Project).filter(Project.owner_id == profile.user_id).all()
        result.append({
            "user_id": profile.user_id,
            "name": f"{profile.first_name} {profile.last_name}".strip(),
            "email": owner.email if owner else "",
            "photo_url": profile.photo_url or "",
            "visibility": profile.visibility.value if profile.visibility else "private",
            "portfolio_slug": profile.portfolio_slug,
            "project_count": len(projects),
            "published_count": sum(1 for p in projects if p.status == ProjectStatus.published),
        })
    return result
