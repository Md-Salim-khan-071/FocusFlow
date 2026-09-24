from datetime import date, datetime

from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    # Authentication will use this properly later
    user_id = Column(Integer, nullable=True)

    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)

    completed = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_date = Column(Date, nullable=True)