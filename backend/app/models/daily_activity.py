from sqlalchemy import (Column, Integer, Text, DateTime, ForeignKey, UniqueConstraint,)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class DailyActivity(Base):
    __tablename__ = "daily_activities"

    __table_args__ = (UniqueConstraint("attendance_id", name="uq_daily_activity_attendance",),)

    id = Column(Integer, primary_key=True, index=True,)
    attendance_id = Column(Integer, ForeignKey("attendance.id"), nullable=False,)
    remarks = Column(Text, nullable=True,)
    created_at = Column(DateTime(timezone=True), server_default=func.now(),)
    attendance = relationship("Attendance", back_populates="daily_activity",)
    items = relationship("DailyActivityItem", back_populates="daily_activity", cascade="all, delete-orphan",)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(),)