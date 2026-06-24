from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class UserRole(str, enum.Enum):
    student = "student"
    employer = "employer"
    coach = "coach"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id_string = Column(String, unique=True, index=True, nullable=True)  # e.g. S-2026-0001
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.student, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    team_memberships = relationship("ProjectTeamMember", back_populates="user", foreign_keys="ProjectTeamMember.user_id")
    feedback_given = relationship("ReviewFeedback", back_populates="coach", foreign_keys="ReviewFeedback.coach_id")
    saved_portfolios = relationship("SavedPortfolio", back_populates="employer", foreign_keys="SavedPortfolio.employer_id")
