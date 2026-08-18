from pydantic import BaseModel
from datetime import datetime

# Schema for creating a new user
class UserCreate(BaseModel):
    name: str
    email: str
    role: str

# Schema for user responses from the API
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime