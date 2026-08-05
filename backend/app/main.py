from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.me import router as me_router
from app.api.users import router as users_router
from app.exceptions.handlers import register_exception_handlers

import app.models

app = FastAPI(
    title="Salesforce Prototype API",
    version="1.0.0",
)

register_exception_handlers(app)

app.include_router(auth_router)
app.include_router(me_router)
app.include_router(users_router)


@app.get("/")
def root():
    return {"message": "Backend is running!"}