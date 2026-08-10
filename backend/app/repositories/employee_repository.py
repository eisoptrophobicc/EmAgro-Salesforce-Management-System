from sqlalchemy.orm import Session

from app.models import Employee

class EmployeeRepository:

    @staticmethod
    def get_latest(db: Session):
        return (db.query(Employee).order_by(Employee.id.desc()).first())

    @staticmethod
    def create(db: Session, employee: Employee):
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def get_by_id(db: Session, employee_id: int):
        return (db.query(Employee).filter(Employee.id == employee_id).first())

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (db.query(Employee).filter(Employee.email == email).first())

    @staticmethod
    def email_exists(db: Session, email: str):
        return (db.query(Employee).filter(Employee.email == email).first() is not None)

    @staticmethod
    def update(db: Session, employee: Employee):
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def belongs_to_sub_admin(db: Session, employee_id: int, sub_admin_id: int,):
        return (db.query(Employee).filter(Employee.id == employee_id, Employee.sub_admin_id == sub_admin_id,).first())

    @staticmethod
    def count(db: Session, sub_admin_id: int,):
        return (db.query(Employee).filter(Employee.sub_admin_id == sub_admin_id).count())

    @staticmethod
    def count_active(db: Session, sub_admin_id: int,):
        return (db.query(Employee).filter(Employee.sub_admin_id == sub_admin_id, Employee.is_active.is_(True),).count())

    @staticmethod
    def count_inactive(db: Session, sub_admin_id: int,):
        return (db.query(Employee).filter(Employee.sub_admin_id == sub_admin_id, Employee.is_active.is_(False),).count())