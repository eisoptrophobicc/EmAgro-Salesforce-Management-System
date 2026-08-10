from datetime import date

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.models import User
from app.schemas.report import (
    AttendanceReportResponse,
    EmployeeReportResponse,
    ProductivityReportResponse,
)
from app.services.export_service import ExportService
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/productivity",
    response_model=ProductivityReportResponse,
)
def productivity_report(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    return ReportService.productivity_report(
        db,
        current_user,
        from_date,
        to_date,
    )


@router.get("/productivity/excel")
def productivity_excel(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.productivity_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.productivity_excel(report)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=productivity_report.xlsx"
        },
    )


@router.get("/productivity/pdf")
def productivity_pdf(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.productivity_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.productivity_pdf(report)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=productivity_report.pdf"},
    )


@router.get(
    "/attendance",
    response_model=AttendanceReportResponse,
)
def attendance_report(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    return ReportService.attendance_report(
        db,
        current_user,
        from_date,
        to_date,
    )


@router.get("/attendance/excel")
def attendance_excel(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.attendance_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.attendance_excel(report)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=attendance_report.xlsx"},
    )


@router.get("/attendance/pdf")
def attendance_pdf(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.attendance_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.attendance_pdf(report)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=attendance_report.pdf"},
    )


@router.get(
    "/employees",
    response_model=EmployeeReportResponse,
)
def employee_report(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    return ReportService.employee_report(
        db,
        current_user,
        from_date,
        to_date,
    )


@router.get("/employees/excel")
def employee_excel(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.employee_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.employee_excel(report)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=employee_report.xlsx",
        },
    )


@router.get("/employees/pdf")
def employee_pdf(
    from_date: date,
    to_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_sub_admin),
):
    report = ReportService.employee_report(
        db,
        current_user,
        from_date,
        to_date,
    )

    buffer = ExportService.employee_pdf(report)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=employee_report.pdf",
        },
    )
