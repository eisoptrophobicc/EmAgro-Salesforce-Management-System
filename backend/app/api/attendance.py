from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.models import User
from app.schemas.attendance import AttendanceResponse, BulkAttendanceRequest
from app.services.attendance_service import AttendanceService
from app.constants.attendance import AttendanceStatus
from app.mappers.attendance_mapper import AttendanceMapper

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


@router.post(
    "/bulk",
    response_model=list[AttendanceResponse],
    status_code=status.HTTP_201_CREATED,
)
def mark_bulk_attendance(
    request: BulkAttendanceRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    return AttendanceService.mark_bulk_attendance(
        db,
        request,
        current_sub_admin,
    )


@router.get(
    "",
    response_model=list[AttendanceResponse],
)
def get_attendance(
    target_date: date,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    attendance_records = AttendanceService.get_attendance_by_date(
        db,
        target_date,
        current_sub_admin,
    )

    return [
        AttendanceMapper.to_response(record)
        for record in attendance_records
    ]


@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse,
)
def update_attendance(
    attendance_id: int,
    status: AttendanceStatus,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    attendance = AttendanceService.update_attendance(
        db,
        attendance_id,
        status,
        current_sub_admin,
    )

    return AttendanceMapper.to_response(attendance)