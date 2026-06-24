from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class VisibilityEnum(str, enum.Enum):
    private = "private"
    public = "public"


class ReviewStatusEnum(str, enum.Enum):
    draft = "draft"
    needs_revision = "needs_revision"
    ready = "ready"
    published = "published"


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    first_name = Column(String, default="")
    last_name = Column(String, default="")
    role = Column(String, default="")       # display role / track
    headline = Column(String, default="")   # title shown on portfolio
    bio = Column(String, default="")
    about_me = Column(String, default="")
    location = Column(String, default="")
    email = Column(String, default="")
    phone = Column(String, default="")

    photo_url = Column(String, default="")
    resume_url = Column(String, default="")
    resume_name = Column(String, default="")

    portfolio_slug = Column(String, unique=True, index=True, nullable=True)
    share_token = Column(String, unique=True, index=True, nullable=True)
    visibility = Column(SAEnum(VisibilityEnum), default=VisibilityEnum.private)
    review_status = Column(SAEnum(ReviewStatusEnum), default=ReviewStatusEnum.draft)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")
    skills = relationship("ProfileSkill", back_populates="profile", cascade="all, delete-orphan")
    target_roles = relationship("ProfileTargetRole", back_populates="profile", cascade="all, delete-orphan")
    education = relationship("ProfileEducation", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("ProfileCertification", back_populates="profile", cascade="all, delete-orphan")
    social_links = relationship("ProfileSocialLinks", back_populates="profile", uselist=False, cascade="all, delete-orphan")


class ProfileSkill(Base):
    __tablename__ = "profile_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    profile = relationship("StudentProfile", back_populates="skills")


class ProfileTargetRole(Base):
    __tablename__ = "profile_target_roles"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    profile = relationship("StudentProfile", back_populates="target_roles")


class ProfileEducation(Base):
    __tablename__ = "profile_education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    degree = Column(String, default="")
    school = Column(String, default="")
    year = Column(String, default="")

    profile = relationship("StudentProfile", back_populates="education")


class ProfileCertification(Base):
    __tablename__ = "profile_certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, default="")
    year = Column(String, default="")

    profile = relationship("StudentProfile", back_populates="certifications")


class ProfileSocialLinks(Base):
    __tablename__ = "profile_social_links"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    linkedin = Column(String, default="")
    github = Column(String, default="")
    website = Column(String, default="")

    profile = relationship("StudentProfile", back_populates="social_links")
