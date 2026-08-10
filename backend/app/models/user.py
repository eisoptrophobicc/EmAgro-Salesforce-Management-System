from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    employees = relationship(
        "Employee",
        back_populates="sub_admin",
    )
    role = relationship("Role", back_populates="users")
    tasks = relationship(
        "Task",
        back_populates="sub_admin",
    )

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
