from fastapi import APIRouter
from backend.services.external_api import fetch_external_characters

router = APIRouter()


@router.get('/external/characters')
async def get_external_characters():
    # Delegate external API handling and caching to the service layer
    return await fetch_external_characters()