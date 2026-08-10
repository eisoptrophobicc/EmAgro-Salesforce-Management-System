from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions.user import (
    AttendanceNotFoundError,
    DailyActivityAlreadyExistsError,
    TaskNotFoundError,
)
from app.models import DailyActivity, DailyActivityItem, User
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.daily_activity_repository import DailyActivityRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.daily_activity import CreateDailyActivityRequest


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
