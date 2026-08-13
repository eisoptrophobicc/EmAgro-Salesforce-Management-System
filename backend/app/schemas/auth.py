from pydantic import BaseModel, EmailStr

from app.schemas.user import PasswordSchema


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminSetupRequest(PasswordSchema):
    full_name: str
    email: EmailStr
    setup_key: str


class AdminSetupStatusResponse(BaseModel):
    setup_required: bool
    setup_key_required: bool
