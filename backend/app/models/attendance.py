from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.constants.attendance import AttendanceStatus
from app.core.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "date",
            name="uq_attendance_employee_date",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False,
    )
    marked_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    date = Column(
        Date,
        nullable=False,
    )
    status = Column(
        Enum(AttendanceStatus),
        nullable=False,
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    employee = relationship(
        "Employee",
        back_populates="attendance",
    )
    sub_admin = relationship(
        "User",
    )
    daily_activity = relationship(
        "DailyActivity",
        back_populates="attendance",
        uselist=False,
    )
