from pydantic import BaseModel

from app.constants.task import TaskInputType


class CreateTaskRequest(BaseModel):
    name: str
    description: str | None = None
    input_type: TaskInputType


class UpdateTaskRequest(BaseModel):
    name: str
    description: str | None = None
    input_type: TaskInputType


class UpdateTaskStatusRequest(BaseModel):
    is_active: bool


class TaskResponse(BaseModel):
    id: int
    name: str
    description: str | None
    input_type: TaskInputType
    is_active: bool

    class Config:
        from_attributes = True
