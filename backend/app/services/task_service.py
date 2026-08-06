from sqlalchemy.orm import Session

from app.models import Task, User
from app.repositories.task_repository import TaskRepository
from app.schemas.task import (CreateTaskRequest, UpdateTaskRequest,)
from app.exceptions.user import TaskAlreadyExistsError, TaskNotFoundError

class TaskService:

    @staticmethod
    def create_task(db: Session, request: CreateTaskRequest, current_user: User,):
        if TaskRepository.exists(db, current_user.id, request.name,):
            raise TaskAlreadyExistsError()

        task = Task(sub_admin_id=current_user.id, name=request.name, description=request.description, input_type=request.input_type,)

        return TaskRepository.create(db, task,)

    @staticmethod
    def get_all_tasks(db: Session, current_user: User,):
        return TaskRepository.get_all(db, current_user.id,)

    @staticmethod
    def get_task_by_id(db: Session, task_id: int, current_user: User,):
        task = TaskRepository.get_by_id(db, task_id, current_user.id,)

        if task is None:
            raise TaskNotFoundError()

        return task

    @staticmethod
    def update_task(db: Session, task_id: int, request: UpdateTaskRequest, current_user: User,):
        task = TaskRepository.get_by_id(db, task_id, current_user.id,)

        if task is None:
            raise TaskNotFoundError()

        task.name = request.name
        task.description = request.description
        task.input_type = request.input_type

        return TaskRepository.update(db, task,)

    @staticmethod
    def update_task_status(db: Session, task_id: int, is_active: bool, current_user: User,):
        task = TaskRepository.get_by_id(db, task_id, current_user.id,)

        if task is None:
            raise TaskNotFoundError()

        task.is_active = is_active

        return TaskRepository.update(db, task,)