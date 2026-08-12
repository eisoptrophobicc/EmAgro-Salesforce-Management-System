from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class EmployeeTask(Base):
    __tablename__ = "employee_tasks"

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "task_id",
            name="uq_employee_task",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False,
    )

    task_id = Column(
        Integer,
        ForeignKey("tasks.id"),
        nullable=False,
    )

    employee = relationship(
        "Employee",
        back_populates="employee_tasks",
    )

    task = relationship(
        "Task",
        back_populates="employee_tasks",
    )