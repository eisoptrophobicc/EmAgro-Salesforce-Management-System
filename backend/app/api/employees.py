from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_sub_admin
from app.mappers.employee_mapper import EmployeeMapper
from app.models import User
from app.schemas.employee import CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeResponse
from app.services.employee_service import EmployeeService

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    request: CreateEmployeeRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    employee = EmployeeService.create_employee(
        db,
        request,
        current_sub_admin,
    )

    return EmployeeMapper.to_response(employee)


@router.get(
    "",
    response_model=list[EmployeeResponse],
)
def get_employees(
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    employees = EmployeeService.get_employees(
        db,
        current_sub_admin,
    )

    return [
        EmployeeMapper.to_response(employee)
        for employee in employees
    ]


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def update_employee(
    employee_id: int,
    request: UpdateEmployeeRequest,
    db: Session = Depends(get_db),
    current_sub_admin: User = Depends(get_current_sub_admin),
):
    employee = EmployeeService.update_employee(
        db,
        employee_id,
        request,
        current_sub_admin,
    )

    return EmployeeMapper.to_response(employee)