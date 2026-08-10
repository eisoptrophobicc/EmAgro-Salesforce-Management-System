from sqlalchemy.orm import Session

from app.models import Task


class TaskRepository:

    @staticmethod
    def create(db: Session, task: Task):
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def exists(
        db: Session,
        sub_admin_id: int,
        name: str,
    ):
        return (
            db.query(Task)
            .filter(
                Task.sub_admin_id == sub_admin_id,
                Task.name == name,
            )
            .first()
            is not None
        )

    @staticmethod
    def get_all(
        db: Session,
        sub_admin_id: int,
    ):
        return db.query(Task).filter(Task.sub_admin_id == sub_admin_id).all()

    @staticmethod
    def get_by_id(
        db: Session,
        task_id: int,
        sub_admin_id: int,
    ):
        return (
            db.query(Task)
            .filter(
                Task.id == task_id,
                Task.sub_admin_id == sub_admin_id,
            )
            .first()
        )

    @staticmethod
    def update(db: Session, task: Task):
        db.commit()
        db.refresh(task)
        return task
