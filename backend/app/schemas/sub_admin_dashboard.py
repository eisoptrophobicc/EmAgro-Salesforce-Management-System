from pydantic import BaseModel

class EmployeeSummary(BaseModel):
    total: int
    active: int
    inactive: int

class AttendanceSummary(BaseModel):
    present: int
    absent: int
    half_day: int
    leave: int

class ProductivitySummary(BaseModel):
    task: str
    total: int

class SubAdminDashboardResponse(BaseModel):
    employees: EmployeeSummary
    attendance: AttendanceSummary
    productivity: list[ProductivitySummary]