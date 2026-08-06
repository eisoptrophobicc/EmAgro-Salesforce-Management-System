from fastapi import FastAPI

from app.exceptions.handlers import register_exception_handlers
from app.api.auth import router as auth_router
from app.api.me import router as me_router
from app.api.users import router as users_router
from app.api.roles import router as roles_router
from app.api.dashboard import router as dashboard_router
from app.api.employees import router as employees_router
from app.api.attendance import router as attendance_router
from app.api.tasks import router as tasks_router
from app.api.daily_activities import router as daily_activities_router

import app.models

app = FastAPI(
    title="Salesforce Prototype API",
    version="1.0.0",
)

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

@app.get("/")
def root():
    return {"message": "Backend is running!"}