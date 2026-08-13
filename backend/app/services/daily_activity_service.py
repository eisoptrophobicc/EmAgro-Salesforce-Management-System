from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions.user import (
    AttendanceNotFoundError,
    DailyActivityAlreadyExistsError,
    DailyActivityNotFoundError,
    EmployeeNotFoundError,
    TaskNotFoundError,
)

from app.models import (
    DailyActivity,
    DailyActivityItem,
    User,
)

from app.repositories.attendance_repository import (
    AttendanceRepository,
)

from app.repositories.daily_activity_repository import (
    DailyActivityRepository,
)

from app.repositories.employee_repository import (
    EmployeeRepository,
)

from app.repositories.employee_task_repository import (
    EmployeeTaskRepository,
)

from app.repositories.task_repository import (
    TaskRepository,
)

from app.schemas.daily_activity import (
    CreateDailyActivityRequest,
    UpdateDailyActivityRequest,
)


class DailyActivityService:

    @staticmethod
    def create_daily_activity(
        db: Session,
        request: CreateDailyActivityRequest,
        current_user: User,
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            request.attendance_id,
        )

        if attendance is None:
            raise AttendanceNotFoundError()

        if attendance.marked_by != current_user.id:
            raise AttendanceNotFoundError()

        if DailyActivityRepository.exists(
            db,
            request.attendance_id,
        ):
            raise DailyActivityAlreadyExistsError()

        activity = DailyActivity(
            attendance_id=request.attendance_id,
            remarks=request.remarks,
        )

        for item in request.items:

            task = TaskRepository.get_by_id(
                db,
                item.task_id,
                current_user.id,
            )

            if task is None:
                raise TaskNotFoundError()

            if not EmployeeTaskRepository.exists(
                db,
                attendance.employee_id,
                item.task_id,
            ):
                raise TaskNotFoundError()

            activity.items.append(
                DailyActivityItem(
                    task_id=item.task_id,
                    value=item.value,
                )
            )

        try:
            return DailyActivityRepository.create(
                db,
                activity,
            )

        except IntegrityError:
            db.rollback()
            raise DailyActivityAlreadyExistsError()


    @staticmethod
    def get_daily_activity(
        db: Session,
        attendance_id: int,
        current_user: User,
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id,
        )

        if attendance is None:
            raise AttendanceNotFoundError()

        if attendance.marked_by != current_user.id:
            raise AttendanceNotFoundError()

        activity = (
            DailyActivityRepository.get_by_attendance_id(
                db,
                attendance_id,
            )
        )

        if activity is None:
            raise DailyActivityNotFoundError()

        return activity


    @staticmethod
    def update_daily_activity(
        db: Session,
        attendance_id: int,
        request: UpdateDailyActivityRequest,
        current_user: User,
    ):
        attendance = AttendanceRepository.get_by_id(
            db,
            attendance_id,
        )

        if attendance is None:
            raise AttendanceNotFoundError()

        if attendance.marked_by != current_user.id:
            raise AttendanceNotFoundError()

        activity = (
            DailyActivityRepository.get_by_attendance_id(
                db,
                attendance_id,
            )
        )

        if activity is None:
            raise DailyActivityNotFoundError()

        existing_items = {
            item.task_id: item
            for item in activity.items
        }

        activity.remarks = request.remarks

        for item in request.items:

            task = TaskRepository.get_by_id(
                db,
                item.task_id,
                current_user.id,
            )

            if task is None:
                raise TaskNotFoundError()

            if not EmployeeTaskRepository.exists(
                db,
                attendance.employee_id,
                item.task_id,
            ):
                raise TaskNotFoundError()

            if item.task_id in existing_items:
                existing_items[item.task_id].value = item.value
            else:
                activity.items.append(
                    DailyActivityItem(
                        task_id=item.task_id,
                        value=item.value,
                    )
                )

        try:
            return DailyActivityRepository.update(
                db,
                activity,
            )

        except IntegrityError:
            db.rollback()
            raise DailyActivityAlreadyExistsError()


    @staticmethod
    def get_employee_tasks(
        db: Session,
        employee_id: int,
        current_user: User,
    ):
        employee = (
            EmployeeRepository.belongs_to_sub_admin(
                db,
                employee_id,
                current_user.id,
            )
        )

        if employee is None:
            raise EmployeeNotFoundError()

        return EmployeeTaskRepository.get_tasks_by_employee(
            db,
            employee_id,
        )
