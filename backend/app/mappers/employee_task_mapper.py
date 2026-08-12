from app.models import EmployeeTask
from app.schemas.employee_task import (
    AssignedTaskResponse,
    EmployeeTaskResponse,
)


class EmployeeTaskMapper:

    @staticmethod
    def to_response(
        employee_task: EmployeeTask,
    ) -> EmployeeTaskResponse:
        return EmployeeTaskResponse(
            id=employee_task.id,
            employee_id=employee_task.employee_id,
            task_id=employee_task.task_id,
        )

    @staticmethod
    def to_assigned_task_response(
        employee_task: EmployeeTask,
    ) -> AssignedTaskResponse:
        task = employee_task.task

        return AssignedTaskResponse(
            id=employee_task.id,
            employee_id=employee_task.employee_id,
            task_id=employee_task.task_id,
            name=task.name,
            description=task.description,
            input_type=task.input_type,
            is_active=task.is_active,
        )

    @staticmethod
    def to_response_list(
        employee_tasks: list[EmployeeTask],
    ) -> list[EmployeeTaskResponse]:
        return [
            EmployeeTaskMapper.to_response(
                employee_task
            )
            for employee_task in employee_tasks
        ]

    @staticmethod
    def to_assigned_task_response_list(
        employee_tasks: list[EmployeeTask],
    ) -> list[AssignedTaskResponse]:
        return [
            EmployeeTaskMapper.to_assigned_task_response(
                employee_task
            )
            for employee_task in employee_tasks
        ]