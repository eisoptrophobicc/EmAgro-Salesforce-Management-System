from pydantic import BaseModel

from app.constants.task import TaskInputType


class AssignTaskRequest(BaseModel):
    employee_id: int
    task_id: int


class EmployeeTaskResponse(BaseModel):
    id: int
    employee_id: int
    task_id: int

    class Config:
        from_attributes = True


class AssignedTaskResponse(BaseModel):
    id: int
    employee_id: int
    task_id: int
    name: str
    description: str | None
    input_type: TaskInputType
    is_active: bool

    class Config:
        from_attributes = True