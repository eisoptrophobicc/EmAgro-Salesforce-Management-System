from pydantic import BaseModel


class UserStatistics(BaseModel):
    total: int
    active: int
    inactive: int
    admins: int
    sub_admins: int
    employees: int


class OperationalStatistics(BaseModel):
    employees: int
    active_employees: int
    tasks: int
    attendance_records: int
    daily_activities: int


class SubAdminOverview(BaseModel):
    id: int
    full_name: str
    email: str
    is_active: bool
    last_login: str | None
    employees: int
    active_employees: int
    tasks: int
    attendance_records: int
    daily_activities: int
    last_activity_date: str | None


class DashboardResponse(BaseModel):
    users: UserStatistics
    operations: OperationalStatistics
    sub_admins: list[SubAdminOverview]
