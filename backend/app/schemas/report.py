from datetime import date

from pydantic import BaseModel, Field


class AttendanceReport(BaseModel):
    present: int
    absent: int
    half_day: int
    leave: int


class ProductivityItem(BaseModel):
    task: str
    total: int


class BooleanProductivityItem(BaseModel):
    task: str
    yes: int
    no: int
    unknown: int
    total: int


class TimelineItem(BaseModel):
    date: date
    total: int


class EmployeeAttendanceItem(BaseModel):
    employee: str
    present: int
    absent: int
    half_day: int
    leave: int


class EmployeeTaskSummary(BaseModel):
    task: str
    total: int


class EmployeeReportItem(BaseModel):
    employee_code: str
    full_name: str
    designation: str
    present: int
    absent: int
    half_day: int
    leave: int
    tasks: list[EmployeeTaskSummary]


class ProductivityReportResponse(BaseModel):
    from_date: date
    to_date: date
    attendance: AttendanceReport
    tasks: list[ProductivityItem]
    numeric_tasks: list[ProductivityItem] = Field(default_factory=list)
    boolean_tasks: list[BooleanProductivityItem] = Field(default_factory=list)
    text_tasks: list[ProductivityItem] = Field(default_factory=list)
    timeline: list[TimelineItem]


class AttendanceReportResponse(BaseModel):
    from_date: date
    to_date: date
    summary: AttendanceReport
    employees: list[EmployeeAttendanceItem]


class EmployeeReportResponse(BaseModel):
    from_date: date
    to_date: date
    employees: list[EmployeeReportItem]
