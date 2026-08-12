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


class AttendanceTrendItem(BaseModel):
    date: str
    present: int
    absent: int
    half_day: int
    leave: int


class ProductivitySummary(BaseModel):
    task: str
    total: int


class ProductivityTrendItem(BaseModel):
    date: str
    total: int


class EmployeeProductivityItem(BaseModel):
    employee: str
    total: int


class SubAdminDashboardResponse(BaseModel):
    employees: EmployeeSummary
    attendance: AttendanceSummary
    attendance_trend: list[AttendanceTrendItem]
    productivity: list[ProductivitySummary]
    productivity_trend: list[ProductivityTrendItem]
    employee_productivity: list[EmployeeProductivityItem]