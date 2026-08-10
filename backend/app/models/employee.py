from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_code = Column(
        String(20),
        unique=True,
        nullable=False,
    )
    full_name = Column(
        String,
        nullable=False,
    )
    email = Column(
        String,
        unique=True,
        nullable=False,
    )
    phone = Column(
        String,
        nullable=True,
    )
    designation = Column(
        String,
        nullable=False,
    )
    is_active = Column(
        Boolean,
        default=True,
    )
    sub_admin_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    sub_admin = relationship(
        "User",
        back_populates="employees",
    )
    attendance = relationship(
        "Attendance",
        back_populates="employee",
    )
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
