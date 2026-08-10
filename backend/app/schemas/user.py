import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class PasswordSchema(BaseModel):
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")

        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter.")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit.")

        return value


class CreateUserRequest(PasswordSchema):
    full_name: str
    email: EmailStr
    role_id: int


class UpdateUserRequest(PasswordSchema):
    full_name: str
    email: EmailStr
    role_id: int


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class UpdateUserStatusRequest(BaseModel):
    is_active: bool


class ResetPasswordRequest(PasswordSchema):
    pass


class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    pages: int
