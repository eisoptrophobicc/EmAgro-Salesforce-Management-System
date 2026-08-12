from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.api.attendance import router as attendance_router
from app.api.auth import router as auth_router
from app.api.daily_activities import router as daily_activities_router
from app.api.dashboard import router as dashboard_router
from app.api.employees import router as employees_router
from app.api.me import router as me_router
from app.api.reports import router as reports_router
from app.api.roles import router as roles_router
from app.api.sub_admin_dashboard import router as sub_admin_dashboard_router
from app.api.tasks import router as tasks_router
from app.api.users import router as users_router
from app.api.employee_task import router as employee_task_router
from app.exceptions.handlers import register_exception_handlers

app = FastAPI(
    title="Salesforce Prototype API",
    version="1.0.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

register_exception_handlers(app)

app.include_router(auth_router)
app.include_router(me_router)
app.include_router(users_router)
app.include_router(roles_router)
app.include_router(dashboard_router)
app.include_router(employees_router)
app.include_router(attendance_router)
app.include_router(tasks_router)
app.include_router(daily_activities_router)
app.include_router(sub_admin_dashboard_router)
app.include_router(reports_router)
app.include_router(employee_task_router)


@app.get("/")
def root():
    return {"message": "Backend is running!"}
