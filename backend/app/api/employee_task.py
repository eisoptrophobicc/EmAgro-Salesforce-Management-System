from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.mappers.employee_task_mapper import EmployeeTaskMapper
from app.models import User
from app.schemas.employee_task import (
    AssignTaskRequest,
    AssignedTaskResponse,
    EmployeeTaskResponse,
)
from app.services.employee_task_service import (
    EmployeeTaskService,
)


router = APIRouter(
    prefix="/employee-tasks",
    tags=["Employee Tasks"],
)


@router.post(
    "",
    response_model=EmployeeTaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_task(
    request: AssignTaskRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(
        get_current_sub_admin
    ),
):
    employee_task = EmployeeTaskService.assign_task(
        db,
        request,
        current_sub_admin,
    )

    return EmployeeTaskMapper.to_response(
        employee_task
    )


@router.get(
    "/employee/{employee_id}",
    response_model=list[AssignedTaskResponse],
)
def get_employee_tasks(
    employee_id: int,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(
        get_current_sub_admin
    ),
):
    employee_tasks = (
        EmployeeTaskService.get_employee_tasks(
            db,
            employee_id,
            current_sub_admin,
        )
    )

    return (
        EmployeeTaskMapper
        .to_assigned_task_response_list(
            employee_tasks
        )
    )


@router.delete(
    "/employee/{employee_id}/task/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unassign_task(
    employee_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(
        get_current_sub_admin
    ),
):
    EmployeeTaskService.unassign_task(
        db,
        employee_id,
        task_id,
        current_sub_admin,
    )