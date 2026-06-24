from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class NamedItem(BaseModel):
    id: Optional[int] = None
    name: str

    model_config = ConfigDict(from_attributes=True)


class ScreenshotItem(BaseModel):
    id: Optional[int] = None
    file_name: str = "Screenshot"
    url: str = ""
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TeamMemberItem(BaseModel):
    id: Optional[int] = None
    user_id: int
    name: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FeedbackItem(BaseModel):
    id: Optional[int] = None
    coach_id: Optional[int] = None
    message: str
    section: str = "Overall project feedback"
    is_resolved: bool = False
    created_at: Optional[datetime] = None
    coach_name: Optional[str] = None
    coach_career: Optional[str] = None
    coach_photo_url: Optional[str] = None
    project_id: Optional[int] = None
    project_title: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProjectCreateRequest(BaseModel):
    title: str = ""
    summary: str = ""
    duration: str = ""
    overview: str = ""
    business_problem: str = ""
    solution: str = ""
    architecture: str = ""
    role: str = ""
    results: str = ""

    github_url: str = ""
    demo_url: str = ""

    status: str = "draft"
    visibility: str = "public"
    is_solo_project: bool = True

    features: List[NamedItem] = []
    tools: List[NamedItem] = []
    skills: List[NamedItem] = []
    team_members: List[TeamMemberItem] = []


class ProjectUpdateRequest(ProjectCreateRequest):
    pass


class ProjectResponse(BaseModel):
    id: int
    owner_id: int

    title: str = ""
    summary: str = ""
    duration: str = ""
    overview: str = ""
    business_problem: str = ""
    solution: str = ""
    architecture: str = ""
    role: str = ""
    results: str = ""

    github_url: str = ""
    demo_url: str = ""

    status: str = "draft"
    visibility: str = "public"
    is_solo_project: bool = True

    features: List[NamedItem] = []
    tools: List[NamedItem] = []
    skills: List[NamedItem] = []
    screenshots: List[ScreenshotItem] = []
    team_members: List[TeamMemberItem] = []
    review_feedback: List[FeedbackItem] = []

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ProjectStatusUpdate(BaseModel):
    status: str


class FeedbackCreateRequest(BaseModel):
    message: str
    section: str = "Overall project feedback"
    status: Optional[str] = None
