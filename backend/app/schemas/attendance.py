from datetime import date

from pydantic import BaseModel

from app.constants.attendance import AttendanceStatus


class AttendanceItem(BaseModel):
    employee_id: int
    status: AttendanceStatus


class BulkAttendanceRequest(BaseModel):
    date: date
    attendance: list[AttendanceItem]


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus

    class Config:
        from_attributes = True
