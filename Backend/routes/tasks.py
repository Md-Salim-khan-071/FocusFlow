from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Task
from schemas import TaskCreate, TaskResponse, TaskUpdate


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    new_task = Task(
        title=task.title,
        category=task.category,
        completed=False,
        archived=False
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db)
):
    return (
        db.query(Task)
        .order_by(Task.id.desc())
        .all()
    )


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    existing_task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not existing_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(existing_task, key, value)

    db.commit()
    db.refresh(existing_task)

    return existing_task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    existing_task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not existing_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(existing_task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }