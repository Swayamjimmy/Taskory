from pydantic import BaseModel
from typing import Literal, Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Literal['pending', 'in_progress', 'completed', 'blocked'] = 'pending'
    priority: Literal['low', 'medium', 'high', 'urgent'] = 'medium'
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal['pending', 'in_progress', 'completed', 'blocked']] = None
    priority: Optional[Literal['low', 'medium', 'high', 'urgent']] = None
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    assigned_to: Optional[int]
    due_date: Optional[date]
    created_at: datetime
    updated_at: datetime

class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    limit: int
    pages: int