from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions.user import (
    EmployeeNotFoundError,
    TaskNotFoundError,
    EmployeeTaskAlreadyExistsError,
    EmployeeTaskNotFoundError
)
from app.models import EmployeeTask, User
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.employee_task_repository import (
    EmployeeTaskRepository,
)
from app.repositories.task_repository import TaskRepository
from app.schemas.employee_task import AssignTaskRequest


class EmployeeTaskService:

    @staticmethod
    def assign_task(
        db: Session,
        request: AssignTaskRequest,
        current_user: User,
    ):
        employee = EmployeeRepository.belongs_to_sub_admin(
            db,
            request.employee_id,
            current_user.id,
        )

        if employee is None:
            raise EmployeeNotFoundError()

        task = TaskRepository.get_by_id(
            db,
            request.task_id,
            current_user.id,
        )

        if task is None:
            raise TaskNotFoundError()

        if EmployeeTaskRepository.exists(
            db,
            request.employee_id,
            request.task_id,
        ):
            raise EmployeeTaskAlreadyExistsError()

        employee_task = EmployeeTask(
            employee_id=request.employee_id,
            task_id=request.task_id,
        )

        try:
            return EmployeeTaskRepository.create(
                db,
                employee_task,
            )

        except IntegrityError:
            db.rollback()

            raise EmployeeTaskAlreadyExistsError()

    @staticmethod
    def get_employee_tasks(
        db: Session,
        employee_id: int,
        current_user: User,
    ):
        employee = EmployeeRepository.belongs_to_sub_admin(
            db,
            employee_id,
            current_user.id,
        )

        if employee is None:
            raise EmployeeNotFoundError()

        return EmployeeTaskRepository.get_by_employee(
            db,
            employee_id,
        )

    @staticmethod
    def unassign_task(
        db: Session,
        employee_id: int,
        task_id: int,
        current_user: User,
    ):
        employee = EmployeeRepository.belongs_to_sub_admin(
            db,
            employee_id,
            current_user.id,
        )

        if employee is None:
            raise EmployeeNotFoundError()

        task = TaskRepository.get_by_id(
            db,
            task_id,
            current_user.id,
        )

        if task is None:
            raise TaskNotFoundError()

        employee_task = (
            EmployeeTaskRepository.get_by_employee_and_task(
                db,
                employee_id,
                task_id,
            )
        )

        if employee_task is None:
            raise EmployeeTaskNotFoundError()

        EmployeeTaskRepository.delete(
            db,
            employee_task,
        )