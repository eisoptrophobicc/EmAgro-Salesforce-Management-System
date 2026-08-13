from pydantic import BaseModel


class DailyActivityItemRequest(BaseModel):
    task_id: int
    value: str


class CreateDailyActivityRequest(BaseModel):
    attendance_id: int
    remarks: str | None = None
    items: list[DailyActivityItemRequest]


class UpdateDailyActivityRequest(BaseModel):
    remarks: str | None = None
    items: list[DailyActivityItemRequest]


class DailyActivityItemResponse(BaseModel):
    task_id: int
    value: str

    class Config:
        from_attributes = True


class DailyActivityResponse(BaseModel):
    id: int
    attendance_id: int
    remarks: str | None
    items: list[DailyActivityItemResponse]

    class Config:
        from_attributes = True
