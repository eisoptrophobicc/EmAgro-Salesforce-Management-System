from sqlalchemy.orm import Session

from app.constants.attendance import AttendanceStatus
from app.models import User
from app.repositories.report_repository import ReportRepository
from app.schemas.report import (
    AttendanceReport,
    AttendanceReportResponse,
    BooleanProductivityItem,
    EmployeeAttendanceItem,
    EmployeeReportItem,
    EmployeeReportResponse,
    EmployeeTaskSummary,
    ProductivityItem,
    ProductivityReportResponse,
    TimelineItem,
)


class ReportService:

    @staticmethod
    def productivity_report(
        db: Session,
        current_user: User,
        from_date,
        to_date,
    ):
        rows = ReportRepository.attendance_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        counts = {row.status: row.total for row in rows}

        attendance = AttendanceReport(
            present=counts.get(AttendanceStatus.PRESENT, 0),
            absent=counts.get(AttendanceStatus.ABSENT, 0),
            half_day=counts.get(AttendanceStatus.HALF_DAY, 0),
            leave=counts.get(AttendanceStatus.LEAVE, 0),
        )

        productivity_rows = ReportRepository.productivity_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        tasks = [
            ProductivityItem(
                task=row.task,
                total=row.total,
            )
            for row in productivity_rows
        ]

        numeric_rows = ReportRepository.numeric_productivity_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        numeric_tasks = [
            ProductivityItem(
                task=row.task,
                total=row.total or 0,
            )
            for row in numeric_rows
        ]

        boolean_rows = ReportRepository.boolean_productivity_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        boolean_tasks = [
            BooleanProductivityItem(
                task=row.task,
                yes=row.yes or 0,
                no=row.no or 0,
                unknown=(
                    row.total
                    - (row.yes or 0)
                    - (row.no or 0)
                ),
                total=row.total,
            )
            for row in boolean_rows
        ]

        text_rows = ReportRepository.text_productivity_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        text_tasks = [
            ProductivityItem(
                task=row.task,
                total=row.total,
            )
            for row in text_rows
        ]

        timeline_rows = ReportRepository.productivity_timeline(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        timeline = [
            TimelineItem(
                date=row.date,
                total=row.total,
            )
            for row in timeline_rows
        ]

        return ProductivityReportResponse(
            from_date=from_date,
            to_date=to_date,
            attendance=attendance,
            tasks=tasks,
            numeric_tasks=numeric_tasks,
            boolean_tasks=boolean_tasks,
            text_tasks=text_tasks,
            timeline=timeline,
        )

    @staticmethod
    def attendance_report(
        db: Session,
        current_user: User,
        from_date,
        to_date,
    ):
        summary_rows = ReportRepository.attendance_summary(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        counts = {row.status: row.total for row in summary_rows}

        summary = AttendanceReport(
            present=counts.get(AttendanceStatus.PRESENT, 0),
            absent=counts.get(AttendanceStatus.ABSENT, 0),
            half_day=counts.get(AttendanceStatus.HALF_DAY, 0),
            leave=counts.get(AttendanceStatus.LEAVE, 0),
        )

        employee_rows = ReportRepository.attendance_by_employee(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        employees = {}

        for row in employee_rows:
            if row.employee not in employees:
                employees[row.employee] = {
                    AttendanceStatus.PRESENT: 0,
                    AttendanceStatus.ABSENT: 0,
                    AttendanceStatus.HALF_DAY: 0,
                    AttendanceStatus.LEAVE: 0,
                }

            employees[row.employee][row.status] = row.total

        employee_reports = [
            EmployeeAttendanceItem(
                employee=name,
                present=stats[AttendanceStatus.PRESENT],
                absent=stats[AttendanceStatus.ABSENT],
                half_day=stats[AttendanceStatus.HALF_DAY],
                leave=stats[AttendanceStatus.LEAVE],
            )
            for name, stats in employees.items()
        ]

        return AttendanceReportResponse(
            from_date=from_date,
            to_date=to_date,
            summary=summary,
            employees=employee_reports,
        )

    @staticmethod
    def employee_report(
        db: Session,
        current_user: User,
        from_date,
        to_date,
    ):
        attendance_rows = ReportRepository.employee_attendance_report(
            db,
            current_user.id,
            from_date,
            to_date,
        )
        task_rows = ReportRepository.employee_task_report(
            db,
            current_user.id,
            from_date,
            to_date,
        )

        employees = {}

        for row in attendance_rows:
            if row.employee_id not in employees:
                employees[row.employee_id] = {
                    "employee_code": row.employee_code,
                    "full_name": row.full_name,
                    "designation": row.designation,
                    "attendance": {
                        AttendanceStatus.PRESENT: 0,
                        AttendanceStatus.ABSENT: 0,
                        AttendanceStatus.HALF_DAY: 0,
                        AttendanceStatus.LEAVE: 0,
                    },
                    "tasks": [],
                }

            employees[row.employee_id]["attendance"][row.status] = row.total

        for row in task_rows:
            employees[row.employee_id]["tasks"].append(
                EmployeeTaskSummary(
                    task=row.task,
                    total=row.total,
                )
            )

        employee_reports = [
            EmployeeReportItem(
                employee_code=data["employee_code"],
                full_name=data["full_name"],
                designation=data["designation"],
                present=data["attendance"][AttendanceStatus.PRESENT],
                absent=data["attendance"][AttendanceStatus.ABSENT],
                half_day=data["attendance"][AttendanceStatus.HALF_DAY],
                leave=data["attendance"][AttendanceStatus.LEAVE],
                tasks=data["tasks"],
            )
            for data in employees.values()
        ]

        return EmployeeReportResponse(
            from_date=from_date,
            to_date=to_date,
            employees=employee_reports,
        )
