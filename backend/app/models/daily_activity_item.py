from sqlalchemy import Column, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class DailyActivityItem(Base):
    __tablename__ = "daily_activity_items"

    __table_args__ = (
        UniqueConstraint(
            "daily_activity_id",
            "task_id",
            name="uq_activity_task",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )
    daily_activity_id = Column(
        Integer,
        ForeignKey("daily_activities.id"),
        nullable=False,
    )
    task_id = Column(
        Integer,
        ForeignKey("tasks.id"),
        nullable=False,
    )
    value = Column(
        Text,
        nullable=False,
    )
    daily_activity = relationship(
        "DailyActivity",
        back_populates="items",
    )
    task = relationship(
        "Task",
        back_populates="activity_items",
    )
