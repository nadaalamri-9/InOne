from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str = "student"
    user_id_string: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    user_id_string: Optional[str]
    first_name: str
    last_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    photo_url: str = ""
    photoUrl: str = ""
    location: str = ""
    phone: str = ""

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class UpdateMeRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class ChangePasswordRequest(BaseModel):
    new_password: str
    old_password: Optional[str] = None
