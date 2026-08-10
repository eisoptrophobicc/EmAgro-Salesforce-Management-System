from pydantic import BaseModel, EmailStr


class CreateEmployeeRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    designation: str


class UpdateEmployeeRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    designation: str
    is_active: bool


class EmployeeResponse(BaseModel):
    id: int
    employee_code: str
    full_name: str
    email: EmailStr
    phone: str | None
    designation: str
    is_active: bool

    class Config:
        from_attributes = True
