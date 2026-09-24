from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import test_database_connection, engine
from models import Base
from routes.tasks import router as task_router


app = FastAPI(
    title="FocusFlow API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(task_router)


@app.get("/")
def root():
    return {
        "message": "FocusFlow API is running"
    }


@app.get("/health")
def health_check():
    database_status = test_database_connection()

    return {
        "status": "healthy" if database_status else "unhealthy",
        "database": "connected" if database_status else "disconnected"
    }