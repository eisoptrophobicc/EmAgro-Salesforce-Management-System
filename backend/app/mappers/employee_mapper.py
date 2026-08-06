from app.models import Employee
from app.schemas.employee import EmployeeResponse

class EmployeeMapper:

    @staticmethod
    def to_response(employee: Employee):
        return EmployeeResponse(id=employee.id, employee_code=employee.employee_code, full_name=employee.full_name, email=employee.email, phone=employee.phone, designation=employee.designation, is_active=employee.is_active)

    @staticmethod
    def to_response_list(employees: list[Employee]):
        return [
            EmployeeMapper.to_response(employee)
            for employee in employees
        ]