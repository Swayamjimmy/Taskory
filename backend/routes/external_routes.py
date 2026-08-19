from fastapi import APIRouter
from backend.services.external_api import fetch_external_users

router = APIRouter()

@router.get('/external/users')
async def get_external_users():
    return await fetch_external_users()