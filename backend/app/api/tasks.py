from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.mappers.task_mapper import TaskMapper
from app.models import User
from app.schemas.task import (
    CreateTaskRequest,
    TaskResponse,
    UpdateTaskRequest,
    UpdateTaskStatusRequest,
)
from app.services.task_service import TaskService

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    request: CreateTaskRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    task = TaskService.create_task(
        db,
        request,
        current_sub_admin,
    )

    return TaskMapper.to_response(task)


@router.get(
    "",
    response_model=list[TaskResponse],
)
def get_tasks(
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    tasks = TaskService.get_all_tasks(
        db,
        current_sub_admin,
    )

    return TaskMapper.to_response_list(tasks)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    task = TaskService.get_task_by_id(
        db,
        task_id,
        current_sub_admin,
    )

    return TaskMapper.to_response(task)


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    request: UpdateTaskRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    task = TaskService.update_task(
        db,
        task_id,
        request,
        current_sub_admin,
    )

    return TaskMapper.to_response(task)


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse,
)
def update_task_status(
    task_id: int,
    request: UpdateTaskStatusRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    task = TaskService.update_task_status(
        db,
        task_id,
        request.is_active,
        current_sub_admin,
    )

    return TaskMapper.to_response(task)
