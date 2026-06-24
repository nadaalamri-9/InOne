from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum as SAEnum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class ProjectStatus(str, enum.Enum):
    draft = "draft"
    needs_revision = "needs_revision"
    ready = "ready"
    published = "published"


class ProjectVisibility(str, enum.Enum):
    public = "public"
    private = "private"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String, default="")
    summary = Column(Text, default="")
    duration = Column(String, default="")
    overview = Column(Text, default="")
    business_problem = Column(Text, default="")
    solution = Column(Text, default="")
    architecture = Column(Text, default="")
    role = Column(String, default="")
    results = Column(Text, default="")

    github_url = Column(String, default="")
    demo_url = Column(String, default="")

    status = Column(SAEnum(ProjectStatus), default=ProjectStatus.draft)
    visibility = Column(SAEnum(ProjectVisibility), default=ProjectVisibility.public)
    is_solo_project = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="projects")
    features = relationship("ProjectFeature", back_populates="project", cascade="all, delete-orphan")
    tools = relationship("ProjectTool", back_populates="project", cascade="all, delete-orphan")
    skills = relationship("ProjectSkill", back_populates="project", cascade="all, delete-orphan")
    screenshots = relationship("ProjectScreenshot", back_populates="project", cascade="all, delete-orphan")
    team_members = relationship("ProjectTeamMember", back_populates="project", cascade="all, delete-orphan")
    review_feedback = relationship("ReviewFeedback", back_populates="project", cascade="all, delete-orphan", order_by="ReviewFeedback.created_at.desc()")


class ProjectFeature(Base):
    __tablename__ = "project_features"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    project = relationship("Project", back_populates="features")


class ProjectTool(Base):
    __tablename__ = "project_tools"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    project = relationship("Project", back_populates="tools")


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    project = relationship("Project", back_populates="skills")


class ProjectScreenshot(Base):
    __tablename__ = "project_screenshots"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String, default="Screenshot")
    url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="screenshots")


class ProjectTeamMember(Base):
    __tablename__ = "project_team_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="team_members")
    user = relationship("User", back_populates="team_memberships", foreign_keys=[user_id])


class ReviewFeedback(Base):
    __tablename__ = "review_feedback"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    coach_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    message = Column(Text, nullable=False)
    section = Column(String, default="Overall project feedback")
    is_resolved = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="review_feedback")
    coach = relationship("User", back_populates="feedback_given", foreign_keys=[coach_id])


class SavedPortfolio(Base):
    __tablename__ = "saved_portfolios"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    employer = relationship("User", back_populates="saved_portfolios", foreign_keys=[employer_id])
    student = relationship("User", foreign_keys=[student_id])
