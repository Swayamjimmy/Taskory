from pydantic import BaseModel
from typing import Literal, Optional
from datetime import date, datetime

# Schema for creating a new task
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    # Only these four values are valid statuses
    status: Literal['pending', 'in_progress', 'completed', 'blocked'] = 'pending'
    priority: Literal['low', 'medium', 'high', 'urgent'] = 'medium'
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

# Schema for updating an existing task (all fields optional)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal['pending', 'in_progress', 'completed', 'blocked']] = None
    priority: Optional[Literal['low', 'medium', 'high', 'urgent']] = None
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

# Schema for task responses from the API
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

# Wrapper for paginated list responses
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    limit: int
    pages: int