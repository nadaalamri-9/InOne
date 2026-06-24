import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.project import (
    Project, ProjectFeature, ProjectTool, ProjectSkill,
    ProjectScreenshot, ProjectTeamMember, ReviewFeedback,
    ProjectStatus, ProjectVisibility,
)
from ..schemas.project import (
    ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse,
    ProjectStatusUpdate,
)
from ..auth.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/projects", tags=["projects"])

UPLOAD_BASE = Path(__file__).parent.parent / "uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


def serialize_project(project: Project) -> dict:
    def member_info(tm: ProjectTeamMember) -> dict:
        u = tm.user
        profile = u.profile if u else None
        return {
            "id": tm.id,
            "user_id": tm.user_id,
            "name": f"{u.first_name} {u.last_name}".strip() if u else "",
            "email": u.email if u else "",
            "photo_url": profile.photo_url if profile else "",
            "role": u.role.value if u else "student",
        }

    def feedback_info(fb: ReviewFeedback) -> dict:
        coach = fb.coach
        coach_profile = coach.profile if coach else None
        return {
            "id": fb.id,
            "coach_id": fb.coach_id,
            "message": fb.message,
            "section": fb.section,
            "is_resolved": fb.is_resolved,
            "created_at": fb.created_at.isoformat() if fb.created_at else None,
            "coach_name": f"{coach.first_name} {coach.last_name}".strip() if coach else "Coach",
            "coach_career": coach_profile.role if coach_profile else "Coach",
            "coach_photo_url": coach_profile.photo_url if coach_profile else "",
            "project_id": fb.project_id,
            "project_title": project.title,
        }

    return {
        "id": project.id,
        "owner_id": project.owner_id,
        "title": project.title or "",
        "summary": project.summary or "",
        "duration": project.duration or "",
        "overview": project.overview or "",
        "business_problem": project.business_problem or "",
        "solution": project.solution or "",
        "architecture": project.architecture or "",
        "role": project.role or "",
        "results": project.results or "",
        "github_url": project.github_url or "",
        "demo_url": project.demo_url or "",
        "status": project.status.value if project.status else "draft",
        "visibility": project.visibility.value if project.visibility else "public",
        "is_solo_project": project.is_solo_project,
        "features": [{"id": f.id, "name": f.name} for f in project.features],
        "tools": [{"id": t.id, "name": t.name} for t in project.tools],
        "skills": [{"id": s.id, "name": s.name} for s in project.skills],
        "screenshots": [
            {"id": sc.id, "file_name": sc.file_name, "url": sc.url, "created_at": sc.created_at.isoformat() if sc.created_at else None}
            for sc in project.screenshots
        ],
        "team_members": [member_info(tm) for tm in project.team_members],
        "review_feedback": [feedback_info(fb) for fb in project.review_feedback],
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None,
    }


def sync_named_list(db, model_class, project_id, field_name, items):
    db.query(model_class).filter(
        getattr(model_class, "project_id") == project_id
    ).delete()
    for item in items:
        name = item.name.strip() if item.name else ""
        if name:
            db.add(model_class(project_id=project_id, name=name))


@router.get("/me")
def get_my_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).order_by(Project.updated_at.desc()).all()
    return [serialize_project(p) for p in projects]


@router.get("")
def list_my_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_my_projects(current_user=current_user, db=db)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        proj_status = ProjectStatus(payload.status)
    except ValueError:
        proj_status = ProjectStatus.draft

    try:
        proj_visibility = ProjectVisibility(payload.visibility)
    except ValueError:
        proj_visibility = ProjectVisibility.public

    project = Project(
        owner_id=current_user.id,
        title=payload.title,
        summary=payload.summary,
        duration=payload.duration,
        overview=payload.overview,
        business_problem=payload.business_problem,
        solution=payload.solution,
        architecture=payload.architecture,
        role=payload.role,
        results=payload.results,
        github_url=payload.github_url,
        demo_url=payload.demo_url,
        status=proj_status,
        visibility=proj_visibility,
        is_solo_project=payload.is_solo_project,
    )
    db.add(project)
    db.flush()

    sync_named_list(db, ProjectFeature, project.id, "name", payload.features)
    sync_named_list(db, ProjectTool, project.id, "name", payload.tools)
    sync_named_list(db, ProjectSkill, project.id, "name", payload.skills)

    if not payload.is_solo_project:
        for member in payload.team_members:
            if member.user_id and member.user_id != current_user.id:
                db.add(ProjectTeamMember(project_id=project.id, user_id=member.user_id))

    db.commit()
    db.refresh(project)
    return serialize_project(project)


@router.get("/{project_id}")
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Allow owner, coach/admin, or public published projects for portfolio viewers.
    role = getattr(current_user.role, "value", str(current_user.role)) if current_user else ""
    is_owner = bool(current_user and project.owner_id == current_user.id)
    is_staff = role in ("coach", "admin")
    is_public_published = (
        getattr(project.visibility, "value", str(project.visibility)) == "public"
        and getattr(project.status, "value", str(project.status)) == "published"
    )
    if not (is_owner or is_staff or is_public_published):
        raise HTTPException(status_code=403, detail="Not authorized")

    return serialize_project(project)


@router.put("/{project_id}")
def update_project(
    project_id: int,
    payload: ProjectUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours")

    project.title = payload.title
    project.summary = payload.summary
    project.duration = payload.duration
    project.overview = payload.overview
    project.business_problem = payload.business_problem
    project.solution = payload.solution
    project.architecture = payload.architecture
    project.role = payload.role
    project.results = payload.results
    project.github_url = payload.github_url
    project.demo_url = payload.demo_url
    project.is_solo_project = payload.is_solo_project

    try:
        project.status = ProjectStatus(payload.status)
    except ValueError:
        pass
    try:
        project.visibility = ProjectVisibility(payload.visibility)
    except ValueError:
        pass

    sync_named_list(db, ProjectFeature, project.id, "name", payload.features)
    sync_named_list(db, ProjectTool, project.id, "name", payload.tools)
    sync_named_list(db, ProjectSkill, project.id, "name", payload.skills)

    db.query(ProjectTeamMember).filter(ProjectTeamMember.project_id == project.id).delete()
    if not payload.is_solo_project:
        for member in payload.team_members:
            if member.user_id and member.user_id != current_user.id:
                db.add(ProjectTeamMember(project_id=project.id, user_id=member.user_id))

    db.commit()
    db.refresh(project)
    return serialize_project(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours")
    db.delete(project)
    db.commit()


@router.patch("/{project_id}/status")
def update_status(
    project_id: int,
    payload: ProjectStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    is_owner = project.owner_id == current_user.id
    is_staff = current_user.role.value in ("coach", "admin")
    if not is_owner and not is_staff:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        project.status = ProjectStatus(payload.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {payload.status}")

    db.commit()
    db.refresh(project)
    return serialize_project(project)


@router.patch("/{project_id}/publish")
def publish_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours")

    project.status = ProjectStatus.published
    db.commit()
    db.refresh(project)
    return serialize_project(project)


@router.post("/{project_id}/screenshots")
async def upload_screenshot(
    project_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Screenshot must be under 10MB")

    folder = UPLOAD_BASE / "project_screenshots"
    folder.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{project_id}_{uuid.uuid4().hex}{ext}"
    file_path = folder / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    screenshot_url = f"/uploads/project_screenshots/{filename}"
    screenshot = ProjectScreenshot(
        project_id=project.id,
        file_name=file.filename or filename,
        url=screenshot_url,
    )
    db.add(screenshot)
    db.commit()
    db.refresh(screenshot)

    return {
        "id": screenshot.id,
        "file_name": screenshot.file_name,
        "url": screenshot.url,
        "created_at": screenshot.created_at.isoformat() if screenshot.created_at else None,
    }


@router.delete("/{project_id}/screenshots/{screenshot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_screenshot(
    project_id: int,
    screenshot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours")

    screenshot = db.query(ProjectScreenshot).filter(
        ProjectScreenshot.id == screenshot_id,
        ProjectScreenshot.project_id == project_id,
    ).first()
    if not screenshot:
        raise HTTPException(status_code=404, detail="Screenshot not found")

    # Delete file from disk
    file_path = UPLOAD_BASE / screenshot.url.replace("/uploads/", "", 1).lstrip("/")
    if file_path.exists():
        file_path.unlink(missing_ok=True)

    db.delete(screenshot)
    db.commit()
