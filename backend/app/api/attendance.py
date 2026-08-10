from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.models import User
from app.schemas.attendance import AttendanceResponse, BulkAttendanceRequest
from app.services.attendance_service import AttendanceService

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
