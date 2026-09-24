from datetime import date, datetime

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    category: str


class TaskUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    completed: bool | None = None
    archived: bool | None = None
    completed_date: date | None = None


class TaskResponse(BaseModel):
    id: int
    user_id: int | None
    title: str
    category: str
    completed: bool
    archived: bool
    created_at: datetime
    completed_date: date | None

    class Config:
        from_attributes = True