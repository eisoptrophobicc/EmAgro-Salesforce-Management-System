from pydantic import BaseModel


class UserStatistics(BaseModel):
    total: int
    active: int
    inactive: int
    admins: int
    sub_admins: int
    employees: int


class DashboardResponse(BaseModel):
    users: UserStatistics
