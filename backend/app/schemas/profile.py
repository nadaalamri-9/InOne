from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class SkillItem(BaseModel):
    id: Optional[int] = None
    name: str

    model_config = ConfigDict(from_attributes=True)


class TargetRoleItem(BaseModel):
    id: Optional[int] = None
    name: str

    model_config = ConfigDict(from_attributes=True)


class EducationItem(BaseModel):
    id: Optional[int] = None
    degree: str = ""
    school: str = ""
    year: str = ""

    model_config = ConfigDict(from_attributes=True)


class CertificationItem(BaseModel):
    id: Optional[int] = None
    name: str = ""
    year: str = ""

    model_config = ConfigDict(from_attributes=True)


class SocialLinksItem(BaseModel):
    linkedin: str = ""
    github: str = ""
    website: str = ""

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    about_me: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    portfolio_slug: Optional[str] = None
    visibility: Optional[str] = None
    review_status: Optional[str] = None

    skills: Optional[List[SkillItem]] = None
    target_roles: Optional[List[TargetRoleItem]] = None
    education: Optional[List[EducationItem]] = None
    certifications: Optional[List[CertificationItem]] = None
    social_links: Optional[SocialLinksItem] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int

    first_name: str = ""
    last_name: str = ""
    role: str = ""
    headline: str = ""
    bio: str = ""
    about_me: str = ""
    location: str = ""
    email: str = ""
    phone: str = ""

    photo_url: str = ""
    resume_url: str = ""
    resume_name: str = ""

    portfolio_slug: Optional[str] = None
    share_token: Optional[str] = None
    visibility: str = "private"
    review_status: str = "draft"

    skills: List[SkillItem] = []
    target_roles: List[TargetRoleItem] = []
    education: List[EducationItem] = []
    certifications: List[CertificationItem] = []
    social_links: Optional[SocialLinksItem] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ShareSettingsResponse(BaseModel):
    visibility: str
    slug: Optional[str] = None
    share_token: Optional[str] = None


class VisibilityUpdateRequest(BaseModel):
    visibility: str
