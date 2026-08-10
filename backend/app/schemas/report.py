from datetime import date

from pydantic import BaseModel


class AttendanceReport(BaseModel):
    present: int
    absent: int
    half_day: int
    leave: int


class ProductivityItem(BaseModel):
    task: str
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
