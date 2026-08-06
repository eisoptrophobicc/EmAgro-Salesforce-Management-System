from sqlalchemy.orm import Session

from app.models import User, Employee
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.employee import (CreateEmployeeRequest, UpdateEmployeeRequest,)
from app.exceptions.handlers import EmployeeAlreadyExistsError

class EmployeeService:

    @staticmethod
    def generate_employee_code(db: Session) -> str:
        latest_employee = EmployeeRepository.get_latest(db)

        if latest_employee is None:
            return "EMP000001"

        next_number = latest_employee.id + 1

        return f"EMP{next_number:06d}"

    @staticmethod
    def create_employee(db: Session, request: CreateEmployeeRequest, current_user: User):
        if EmployeeRepository.email_exists(db, request.email):
            raise EmployeeAlreadyExistsError()

        employee = Employee(employee_code=EmployeeService.generate_employee_code(db), full_name=request.full_name, email=request.email, phone=request.phone, designation=request.designation, sub_admin_id=current_user.id)

        return EmployeeRepository.create(db, employee)