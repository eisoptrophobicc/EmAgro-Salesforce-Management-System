from pydantic import BaseModel, EmailStr

class CreateUserRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role_id: int

class UpdateUserRequest(BaseModel):
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