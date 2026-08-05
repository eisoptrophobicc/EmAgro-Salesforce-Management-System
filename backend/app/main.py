from fastapi import FastAPI

from app.core.database import Base, engine
from app.api.auth import router as auth_router

# Import models so SQLAlchemy knows about them
import app.models

app = FastAPI(
    title="Salesforce Prototype API",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}