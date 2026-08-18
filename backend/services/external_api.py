import httpx
from datetime import datetime, timedelta

# In-memory cache to avoid repeated external calls
_cache = {}
_cache_ttl = timedelta(minutes=5)

async def fetch_external_users():
    now = datetime.utcnow()
    # Return cached data if it is still fresh
    if 'users' in _cache and now - _cache['users']['timestamp'] < _cache_ttl:
        return _cache['users']['data']
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get('https://jsonplaceholder.typicode.com/users')
            response.raise_for_status()
            data = response.json()
            # Store the response with a timestamp for TTL checks
            _cache['users'] = {'data': data, 'timestamp': now}
            return data
    except httpx.TimeoutException:
        return {'error': 'Request timed out'}
    except httpx.HTTPStatusError as e:
        return {'error': f'HTTP error: {e.response.status_code}'}