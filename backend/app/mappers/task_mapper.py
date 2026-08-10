from app.models import Task
from app.schemas.task import TaskResponse


class TaskMapper:

    @staticmethod
    def to_response(task: Task) -> TaskResponse:
        return TaskResponse.model_validate(task)

    @staticmethod
    def to_response_list(tasks: list[Task]) -> list[TaskResponse]:
        return [TaskMapper.to_response(task) for task in tasks]
