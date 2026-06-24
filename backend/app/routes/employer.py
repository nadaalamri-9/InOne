from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import StudentProfile
from ..models.project import Project, ProjectStatus, SavedPortfolio
from ..routes.projects import serialize_project
from ..auth.dependencies import require_employer

router = APIRouter(prefix="/employer", tags=["employer"])


def _build_candidate(student: User, db: Session) -> dict:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()
    if not profile:
        return None

    if profile.visibility and profile.visibility.value == "private":
        return None

    published_projects = (
        db.query(Project)
        .filter(Project.owner_id == student.id, Project.status == ProjectStatus.published)
        .all()
    )

    skills = list({s.name for s in profile.skills})
    for p in published_projects:
        skills.extend(t.name for t in p.tools)
        skills.extend(s.name for s in p.skills)

    unique_skills = list(dict.fromkeys(skills))[:8]

    slug = profile.portfolio_slug or str(student.id)

    return {
        "id": student.id,
        "full_name": f"{profile.first_name} {profile.last_name}".strip() or f"{student.first_name} {student.last_name}".strip(),
        "role": profile.role or "Student",
        "headline": profile.headline or "",
        "location": profile.location or "",
        "email": student.email,
        "photo_url": profile.photo_url or "",
        "skills": unique_skills,
        "target_roles": [t.name for t in profile.target_roles],
        "projects": [serialize_project(p) for p in published_projects],
        "project_count": len(published_projects),
        "featured_project": serialize_project(published_projects[0]) if published_projects else None,
        "status": "Public",
        "portfolio_url": f"/portfolio/share/{slug}",
    }


@router.get("/dashboard")
def employer_dashboard(
    current_user: User = Depends(require_employer),
    db: Session = Depends(get_db),
):
    students = db.query(User).filter(User.role == UserRole.student).all()
    candidates = [c for s in students if (c := _build_candidate(s, db))]

    saved_records = (
        db.query(SavedPortfolio)
        .filter(SavedPortfolio.employer_id == current_user.id)
        .all()
    )
    saved_ids = [r.student_id for r in saved_records]

    published_count = sum(c["project_count"] for c in candidates)

    return {
        "stats": {
            "total_students": len(candidates),
            "saved_portfolios": len(saved_ids),
            "published_projects": published_count,
        },
        "candidates": candidates[:6],
        "saved_ids": saved_ids,
    }


@router.get("/candidates")
def employer_candidates(
    current_user: User = Depends(require_employer),
    db: Session = Depends(get_db),
):
    students = db.query(User).filter(User.role == UserRole.student).all()
    return [c for s in students if (c := _build_candidate(s, db))]


@router.get("/saved")
def employer_saved(
    current_user: User = Depends(require_employer),
    db: Session = Depends(get_db),
):
    saved_records = (
        db.query(SavedPortfolio)
        .filter(SavedPortfolio.employer_id == current_user.id)
        .all()
    )
    result = []
    for record in saved_records:
        student = db.query(User).filter(User.id == record.student_id).first()
        if not student:
            continue
        candidate = _build_candidate(student, db)
        if candidate:
            candidate["saved_at"] = record.saved_at.isoformat() if record.saved_at else None
            result.append(candidate)
    return result


@router.post("/saved/{student_id}", status_code=status.HTTP_201_CREATED)
def save_portfolio(
    student_id: int,
    current_user: User = Depends(require_employer),
    db: Session = Depends(get_db),
):
    existing = db.query(SavedPortfolio).filter(
        SavedPortfolio.employer_id == current_user.id,
        SavedPortfolio.student_id == student_id,
    ).first()
    if not existing:
        db.add(SavedPortfolio(employer_id=current_user.id, student_id=student_id))
        db.commit()
    return {"detail": "Saved"}


@router.delete("/saved/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_portfolio(
    student_id: int,
    current_user: User = Depends(require_employer),
    db: Session = Depends(get_db),
):
    record = db.query(SavedPortfolio).filter(
        SavedPortfolio.employer_id == current_user.id,
        SavedPortfolio.student_id == student_id,
    ).first()
    if record:
        db.delete(record)
        db.commit()
