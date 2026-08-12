from sqlalchemy.orm import Session

from app.models import EmployeeTask, Task


class EmployeeTaskRepository:

    @staticmethod
    def create(
        db: Session,
        employee_task: EmployeeTask,
    ):
        db.add(employee_task)
        db.commit()
        db.refresh(employee_task)

        return employee_task

    @staticmethod
    def exists(
        db: Session,
        employee_id: int,
        task_id: int,
    ):
        return (
            db.query(EmployeeTask)
            .filter(
                EmployeeTask.employee_id == employee_id,
                EmployeeTask.task_id == task_id,
            )
            .first()
            is not None
        )

    @staticmethod
    def get_by_employee(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(EmployeeTask)
            .filter(
                EmployeeTask.employee_id == employee_id,
            )
            .all()
        )

    @staticmethod
    def get_tasks_by_employee(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(Task)
            .join(
                EmployeeTask,
                EmployeeTask.task_id == Task.id,
            )
            .filter(
                EmployeeTask.employee_id == employee_id,
                Task.is_active.is_(True),
            )
            .all()
        )

    @staticmethod
    def get_by_employee_and_task(
        db: Session,
        employee_id: int,
        task_id: int,
    ):
        return (
            db.query(EmployeeTask)
            .filter(
                EmployeeTask.employee_id == employee_id,
                EmployeeTask.task_id == task_id,
            )
            .first()
        )

    @staticmethod
    def delete(
        db: Session,
        employee_task: EmployeeTask,
    ):
        db.delete(employee_task)
        db.commit()