from fastapi import APIRouter, Depends, Request
from backend.schemas.user_schemas import UserCreate
from backend.repositories.user_repository import UserRepository

router = APIRouter()

def get_pool(request: Request):
    return request.app.state.db_pool

# List all users
@router.get('/users')
async def list_users(pool=Depends(get_pool)):
    repo = UserRepository(pool)
    rows = await repo.get_all()
    return [dict(r) for r in rows]

# Create a new user
@router.post('/users', status_code=201)
async def create_user(data: UserCreate, pool=Depends(get_pool)):
    repo = UserRepository(pool)
    row = await repo.create(data)
    return dict(row)