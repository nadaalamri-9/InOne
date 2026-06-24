from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole
from ..models.profile import StudentProfile
from ..models.project import Project, ProjectStatus, ReviewFeedback
from ..schemas.project import FeedbackCreateRequest, ProjectStatusUpdate
from ..routes.projects import serialize_project
from ..auth.dependencies import require_coach_or_admin

router = APIRouter(prefix="/coach", tags=["coach"])


def _projects_needing_review(db: Session):
    return (
        db.query(Project)
        .filter(Project.status.in_([ProjectStatus.draft, ProjectStatus.needs_revision, ProjectStatus.ready]))
        .order_by(Project.updated_at.desc())
        .all()
    )


def _enrich_with_student(project: Project, db: Session) -> dict:
    data = serialize_project(project)
    owner = db.query(User).filter(User.id == project.owner_id).first()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == project.owner_id).first()
    data["student_name"] = f"{owner.first_name} {owner.last_name}".strip() if owner else "Student"
    data["student_email"] = owner.email if owner else ""
    data["student_photo_url"] = profile.photo_url if profile else ""
    return data


def _feedback_with_project_info(feedback: ReviewFeedback, db: Session) -> dict:
    project = feedback.project or db.query(Project).filter(Project.id == feedback.project_id).first()
    coach = feedback.coach or db.query(User).filter(User.id == feedback.coach_id).first()
    owner = db.query(User).filter(User.id == project.owner_id).first() if project else None
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == project.owner_id).first() if project else None
    coach_profile = db.query(StudentProfile).filter(StudentProfile.user_id == coach.id).first() if coach else None

    return {
        "id": feedback.id,
        "project_id": feedback.project_id,
        "project_title": project.title if project else "Project",
        "student_name": f"{owner.first_name} {owner.last_name}".strip() if owner else "Student",
        "student_email": owner.email if owner else "",
        "student_photo_url": profile.photo_url if profile else "",
        "status": project.status.value if project and project.status else "draft",
        "message": feedback.message,
        "section": feedback.section,
        "is_resolved": feedback.is_resolved,
        "created_at": feedback.created_at.isoformat() if feedback.created_at else None,
        "coach_id": feedback.coach_id,
        "coach_name": f"{coach.first_name} {coach.last_name}".strip() if coach else "Coach",
        "coach_photo_url": coach_profile.photo_url if coach_profile else "",
    }


@router.get("/dashboard")
def coach_dashboard(
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    projects = _projects_needing_review(db)
    all_feedback = (
        db.query(ReviewFeedback)
        .order_by(ReviewFeedback.created_at.desc())
        .all()
    )

    return {
        "stats": {
            "projects": len(projects),
            "needs_revision": sum(1 for p in projects if p.status == ProjectStatus.needs_revision),
            "feedback": len(all_feedback),
            "published": db.query(Project).filter(Project.status == ProjectStatus.published).count(),
        },
        "recent_projects": [_enrich_with_student(p, db) for p in projects[:5]],
        "feedback": [_feedback_with_project_info(fb, db) for fb in all_feedback[:5]],
    }


@router.get("/feedback")
def coach_feedback(
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    feedback_items = (
        db.query(ReviewFeedback)
        .order_by(ReviewFeedback.created_at.desc())
        .all()
    )
    return [_feedback_with_project_info(item, db) for item in feedback_items]


@router.get("/students")
def coach_students(
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    students = db.query(User).filter(User.role == UserRole.student).all()
    result = []
    for student in students:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()
        projects = db.query(Project).filter(Project.owner_id == student.id).all()
        feedback_count = sum(len(p.review_feedback) for p in projects)
        open_count = sum(
            sum(1 for fb in p.review_feedback if not fb.is_resolved)
            for p in projects
        )
        result.append({
            "id": student.id,
            "name": f"{student.first_name} {student.last_name}".strip(),
            "email": student.email,
            "photo_url": profile.photo_url if profile else "",
            "location": profile.location if profile else "",
            "role": profile.role if profile else "Student",
            "projects_count": len(projects),
            "ready_count": sum(1 for p in projects if p.status == ProjectStatus.ready),
            "published_count": sum(1 for p in projects if p.status == ProjectStatus.published),
            "needs_revision_count": sum(1 for p in projects if p.status == ProjectStatus.needs_revision),
            "feedback_count": feedback_count,
            "open_feedback_count": open_count,
            "last_updated": student.updated_at.isoformat() if student.updated_at else "",
        })
    return result


@router.get("/projects")
def coach_projects(
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    projects = _projects_needing_review(db)
    return [_enrich_with_student(p, db) for p in projects]


@router.get("/projects/{project_id}")
def coach_project_detail(
    project_id: int,
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return _enrich_with_student(project, db)


@router.post("/projects/{project_id}/feedback")
def add_feedback(
    project_id: int,
    payload: FeedbackCreateRequest,
    current_user: User = Depends(require_coach_or_admin),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    feedback = ReviewFeedback(
        project_id=project_id,
        coach_id=current_user.id,
        message=payload.message,
        section=payload.section,
    )
    db.add(feedback)

    # Update project status if requested
    if payload.status:
        try:
            project.status = ProjectStatus(payload.status)
        except ValueError:
            pass

    db.commit()
    db.refresh(feedback)
    db.refresh(project)

    coach_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    return {
        "id": feedback.id,
        "project_id": feedback.project_id,
        "coach_id": feedback.coach_id,
        "message": feedback.message,
        "section": feedback.section,
        "is_resolved": feedback.is_resolved,
        "created_at": feedback.created_at.isoformat() if feedback.created_at else None,
        "coach_name": f"{current_user.first_name} {current_user.last_name}".strip(),
        "coach_career": coach_profile.role if coach_profile else "Coach",
        "coach_photo_url": coach_profile.photo_url if coach_profile else "",
        "project": serialize_project(project),
    }
