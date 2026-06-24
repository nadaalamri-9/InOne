import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import StudentProfile
from ..models.project import Project, ProjectStatus
from ..routes.profile import serialize_profile
from ..routes.projects import serialize_project
from ..auth.dependencies import get_current_user, get_current_user_optional
from ..schemas.profile import ShareSettingsResponse, VisibilityUpdateRequest

router = APIRouter(tags=["portfolio"])


def build_portfolio(profile: StudentProfile, projects: list) -> dict:
    published = [p for p in projects if p.status == ProjectStatus.published]
    return {
        "profile": serialize_profile(profile),
        "projects": [serialize_project(p) for p in published],
    }


# ── Student's own portfolio ──────────────────────────────────────────────────

@router.get("/portfolio/me")
def get_my_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    return build_portfolio(profile, projects)


# ── Share settings ────────────────────────────────────────────────────────────

@router.get("/me/portfolio/share")
def get_share_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "visibility": profile.visibility.value if profile.visibility else "private",
        "slug": profile.portfolio_slug,
        "share_token": profile.share_token,
    }


@router.patch("/me/portfolio/visibility")
def update_visibility(
    payload: VisibilityUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    from ..models.profile import VisibilityEnum
    try:
        profile.visibility = VisibilityEnum(payload.visibility)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid visibility value")

    db.commit()
    db.refresh(profile)
    return {
        "visibility": profile.visibility.value,
        "slug": profile.portfolio_slug,
        "share_token": profile.share_token,
    }


@router.post("/me/portfolio/share/regenerate")
def regenerate_share_token(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.share_token = secrets.token_urlsafe(16)
    db.commit()
    return {"share_token": profile.share_token}


# ── Public portfolio by slug ──────────────────────────────────────────────────

@router.get("/portfolio/share/{slug}")
def get_public_portfolio(
    slug: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.portfolio_slug == slug).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    is_owner = current_user and current_user.id == profile.user_id
    is_staff = current_user and current_user.role.value in ("coach", "admin")

    if profile.visibility and profile.visibility.value == "private" and not is_owner and not is_staff:
        return {
            "profile": {
                "id": profile.id,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "visibility": "private",
            },
            "projects": [],
            "is_private": True,
        }

    projects = db.query(Project).filter(Project.owner_id == profile.user_id).all()
    result = build_portfolio(profile, projects)
    result["is_private"] = False
    return result


# ── Student portfolio by user ID ─────────────────────────────────────────────

@router.get("/students/{student_id}")
def get_student_portfolio(
    student_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")

    is_owner = current_user and current_user.id == student_id
    is_staff = current_user and current_user.role.value in ("coach", "admin", "employer")

    user = db.query(User).filter(User.id == profile.user_id).first()
    first_name = profile.first_name or (user.first_name if user else "") or ""
    last_name = profile.last_name or (user.last_name if user else "") or ""
    full_name = f"{first_name} {last_name}".strip() or (user.email if user else "Student")
    photo_url = profile.photo_url or ""

    if profile.visibility and profile.visibility.value == "private" and not is_owner and not is_staff:
        return {
            "id": profile.user_id,
            "user_id": profile.user_id,
            "first_name": first_name,
            "last_name": last_name,
            "fullName": full_name,
            "name": full_name,
            "photo_url": photo_url,
            "photoUrl": photo_url,
            "visibility": "private",
            "is_private": True,
            "projects": [],
        }

    projects = db.query(Project).filter(Project.owner_id == student_id).all()
    result = build_portfolio(profile, projects)
    result["id"] = profile.user_id
    result["user_id"] = profile.user_id
    result["first_name"] = first_name
    result["last_name"] = last_name
    result["fullName"] = full_name
    result["name"] = full_name
    result["photo_url"] = photo_url
    result["photoUrl"] = photo_url
    result["visibility"] = profile.visibility.value if profile.visibility else "private"
    result["is_private"] = False
    return result


# ── Browse public portfolios ──────────────────────────────────────────────────

@router.get("/portfolio/public")
def list_public_portfolios(db: Session = Depends(get_db)):
    from ..models.profile import VisibilityEnum
    profiles = (
        db.query(StudentProfile)
        .filter(StudentProfile.visibility == VisibilityEnum.public)
        .all()
    )
    result = []
    for profile in profiles:
        projects = (
            db.query(Project)
            .filter(Project.owner_id == profile.user_id, Project.status == ProjectStatus.published)
            .order_by(Project.updated_at.desc())
            .all()
        )
        featured = projects[0] if projects else None

        # Fall back to the User record when the profile name is blank.
        user = db.query(User).filter(User.id == profile.user_id).first()
        first_name = profile.first_name or (user.first_name if user else "") or ""
        last_name = profile.last_name or (user.last_name if user else "") or ""
        full_name = f"{first_name} {last_name}".strip() or (user.email if user else "Student")

        result.append({
            "id": profile.user_id,
            "fullName": full_name,
            "first_name": first_name,
            "last_name": last_name,
            "role": profile.role or profile.headline or "",
            "headline": profile.headline or "",
            "location": profile.location or "",
            "photoUrl": profile.photo_url or "",
            "photo_url": profile.photo_url or "",
            "skills": [s.name for s in profile.skills],
            "targetRoles": [t.name for t in profile.target_roles],
            "portfolio_slug": profile.portfolio_slug or "",
            "portfolioUrl": f"/portfolio/student/{profile.user_id}",
            "project_count": len(projects),
            "featuredProject": {
                "id": featured.id,
                "title": featured.title,
                "summary": featured.summary,
                "status": featured.status.value if featured.status else "published",
            } if featured else None,
            "projects": [{"id": p.id, "title": p.title, "status": p.status.value if p.status else "published"} for p in projects],
        })
    return result
