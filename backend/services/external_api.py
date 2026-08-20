import httpx
from datetime import datetime, timedelta

# In-memory cache to avoid repeated external API calls
_cache = {}
_cache_ttl = timedelta(minutes=5)


async def fetch_external_characters():
    now = datetime.utcnow()

    # Return cached data if it is still fresh
    if (
        'characters' in _cache
        and now - _cache['characters']['timestamp'] < _cache_ttl
    ):
        return _cache['characters']['data']

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                'https://rickandmortyapi.com/api/character',
                params={'page': 1}
            )

            response.raise_for_status()

            data = response.json()

            characters = data['results']

            _cache['characters'] = {
                'data': characters,
                'timestamp': now
            }

            return characters

    except httpx.TimeoutException:
        return {
            'error': 'Request timed out while contacting the Rick and Morty API'
        }

    except httpx.HTTPStatusError as e:
        return {
            'error': f'External API returned HTTP {e.response.status_code}'
        }

    except httpx.RequestError:
        return {
            'error': 'Could not connect to the external API'
        }