from sqlalchemy import (Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, UniqueConstraint,)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
from app.constants.task import TaskInputType


class Task(Base):
    __tablename__ = "tasks"

    __table_args__ = (UniqueConstraint("sub_admin_id", "name", name="uq_task_sub_admin_name",),)

    id = Column(Integer, primary_key=True, index=True)
    sub_admin_id = Column(Integer, ForeignKey("users.id"), nullable=False,)
    name = Column(String, nullable=False,)
    description = Column(String, nullable=True,)
    input_type = Column(Enum(TaskInputType), nullable=False,)
    is_active = Column(Boolean, nullable=False, default=True,)
    created_at = Column(DateTime(timezone=True), server_default=func.now(),)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(),)
    sub_admin = relationship("User", back_populates="tasks",)