from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user_optional
from ..database import get_db
from ..models.profile import StudentProfile
from ..models.project import Project
from ..models.user import User
from ..routes.profile import serialize_profile
from ..routes.projects import serialize_project
from ..schemas.ai import (
    PortfolioSummaryRequest,
    PortfolioSummaryResponse,
    ProjectCheckRequest,
    ProjectCheckResponse,
)
from ..services.llm import check_project_content, generate_portfolio_summary

router = APIRouter(prefix="/ai", tags=["ai"])


def _pick(data: Dict[str, Any], *keys: str, default: Any = "") -> Any:
    for key in keys:
        value = data.get(key)
        if value not in (None, ""):
            return value
    return default


def _named_list(items: Any) -> List[Dict[str, str]]:
    if not isinstance(items, list):
        return []
    normalized = []
    for item in items:
        if isinstance(item, str) and item.strip():
            normalized.append({"name": item.strip()})
        elif isinstance(item, dict):
            name = _pick(item, "name", "title", "label")
            if str(name).strip():
                normalized.append({"name": str(name).strip()})
    return normalized


def _normalize_portfolio_payload(profile: Dict[str, Any], projects: List[Dict[str, Any]]) -> tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """Accepts the frontend portfolio shape or the database serializer shape."""
    profile = profile or {}
    student = profile.get("student") if isinstance(profile.get("student"), dict) else profile

    normalized_profile = {
        "first_name": _pick(student, "first_name", "firstName"),
        "last_name": _pick(student, "last_name", "lastName"),
        "role": _pick(student, "role", "title", "track"),
        "headline": _pick(student, "headline"),
        "bio": _pick(student, "bio"),
        "about_me": _pick(student, "about_me", "aboutMe", "about"),
        "location": _pick(student, "location"),
        "email": _pick(student, "email"),
        "phone": _pick(student, "phone"),
        "skills": _named_list(_pick(profile, "skills", default=[])),
        "target_roles": _named_list(_pick(profile, "target_roles", "targetRoles", default=[])),
        "education": profile.get("education", []),
        "certifications": profile.get("certifications", []),
    }

    normalized_projects = []
    for project in projects or profile.get("projects", []) or []:
        if not isinstance(project, dict):
            continue
        normalized_projects.append(_normalize_project_payload(project, default_published=True))

    return normalized_profile, normalized_projects


def _normalize_project_payload(project: Dict[str, Any], default_published: bool = False) -> Dict[str, Any]:
    """Accepts camelCase frontend projects or snake_case backend projects."""
    project = project or {}
    status = _pick(project, "status", default="published" if default_published else "draft")
    if str(status).lower() == "published":
        normalized_status = "published"
    elif str(status).lower() == "published project":
        normalized_status = "published"
    else:
        normalized_status = str(status).lower().replace(" ", "_")

    return {
        "id": project.get("id"),
        "title": _pick(project, "title", default="Untitled project"),
        "summary": _pick(project, "summary", "description"),
        "duration": _pick(project, "duration", "date"),
        "overview": _pick(project, "overview", "description"),
        "business_problem": _pick(project, "business_problem", "businessProblem", "problem"),
        "solution": _pick(project, "solution"),
        "architecture": _pick(project, "architecture"),
        "role": _pick(project, "role"),
        "results": _pick(project, "results"),
        "features": _named_list(_pick(project, "features", default=[])),
        "tools": _named_list(_pick(project, "tools", "tech_stack", default=[])),
        "skills": _named_list(_pick(project, "skills", default=[])),
        "github_url": _pick(project, "github_url", "githubUrl"),
        "demo_url": _pick(project, "demo_url", "demoUrl"),
        "status": normalized_status,
    }


def _role_value(user: Optional[User]) -> str:
    if not user or not user.role:
        return ""
    return getattr(user.role, "value", str(user.role))


@router.post("/portfolio-summary", response_model=PortfolioSummaryResponse)
def ai_portfolio_summary(
    payload: Optional[PortfolioSummaryRequest] = Body(default=None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    # When the frontend passes the visible portfolio, summarize that exact page.
    # This makes the popup work for owner, shared, and public portfolio pages.
    if payload and payload.profile:
        profile_data, projects_data = _normalize_portfolio_payload(
            payload.profile,
            payload.projects or [],
        )
        summary = generate_portfolio_summary(profile_data, projects_data)
        return PortfolioSummaryResponse(summary=summary)

    if not current_user:
        raise HTTPException(status_code=401, detail="Login or provide portfolio data to generate a summary.")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please complete your profile first.")

    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()

    profile_data = serialize_profile(profile)
    projects_data = [serialize_project(p) for p in projects]

    summary = generate_portfolio_summary(profile_data, projects_data)
    return PortfolioSummaryResponse(summary=summary)


@router.post("/project-check/{project_id}", response_model=ProjectCheckResponse)
def ai_project_check(
    project_id: int,
    payload: Optional[ProjectCheckRequest] = Body(default=None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project:
        is_owner = current_user and project.owner_id == current_user.id
        is_staff = _role_value(current_user) in ("coach", "admin")
        is_public_published = (
            getattr(project.visibility, "value", str(project.visibility)) == "public"
            and getattr(project.status, "value", str(project.status)) == "published"
        )

        if not (is_owner or is_staff or is_public_published):
            raise HTTPException(status_code=403, detail="Not authorized to check this project")

        project_data = serialize_project(project)
    elif payload and payload.project:
        # Fallback for already-visible frontend data.
        project_data = _normalize_project_payload(payload.project)
    else:
        raise HTTPException(status_code=404, detail="Project not found")

    result = check_project_content(_normalize_project_payload(project_data))

    suggestions = result.get("improvement_suggestions", [])
    if isinstance(suggestions, str):
        suggestions = [suggestions]
    elif not isinstance(suggestions, list):
        suggestions = []

    return ProjectCheckResponse(
        overall_score=int(result.get("overall_score", 50)),
        ai_likelihood=str(result.get("ai_likelihood", "low")),
        clarity_score=int(result.get("clarity_score", 50)),
        completeness_score=int(result.get("completeness_score", 50)),
        feedback=str(result.get("feedback", "")),
        improvement_suggestions=suggestions,
    )
