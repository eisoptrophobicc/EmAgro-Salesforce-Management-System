from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions.user import EmployeeAlreadyExistsError, EmployeeNotFoundError
from app.models import Employee, User
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.employee import CreateEmployeeRequest, UpdateEmployeeRequest


class EmployeeService:

    @staticmethod
    def generate_employee_code(db: Session) -> str:
        latest_employee = EmployeeRepository.get_latest(db)

        if latest_employee is None:
            return "EMP000001"

        next_number = latest_employee.id + 1

        return f"EMP{next_number:06d}"

    @staticmethod
    def create_employee(
        db: Session, request: CreateEmployeeRequest, current_user: User
    ):
        if EmployeeRepository.email_exists(db, request.email):
            raise EmployeeAlreadyExistsError()

        employee = Employee(
            employee_code=EmployeeService.generate_employee_code(db),
            full_name=request.full_name,
            email=request.email,
            phone=request.phone,
            designation=request.designation,
            sub_admin_id=current_user.id,
        )

        try:
            return EmployeeRepository.create(db, employee)
        except IntegrityError:
            db.rollback()
            raise EmployeeAlreadyExistsError()

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        request: UpdateEmployeeRequest,
        current_user: User,
    ):
        employee = EmployeeRepository.belongs_to_sub_admin(
            db,
            employee_id,
            current_user.id,
        )

        if employee is None:
            raise EmployeeNotFoundError()

        existing_employee = EmployeeRepository.get_by_email(
            db,
            request.email,
        )

        if (
            existing_employee is not None
            and existing_employee.id != employee.id
        ):
            raise EmployeeAlreadyExistsError()

        employee.full_name = request.full_name
        employee.email = request.email
        employee.phone = request.phone
        employee.designation = request.designation
        employee.is_active = request.is_active

        try:
            return EmployeeRepository.update(db, employee)
        except IntegrityError:
            db.rollback()
            raise EmployeeAlreadyExistsError()

    @staticmethod
    def get_employees(db: Session, current_user: User):
        return EmployeeRepository.get_all(
            db,
            current_user.id,
        )
