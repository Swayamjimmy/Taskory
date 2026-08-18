from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from backend.routes import task_routes, user_routes
from fastapi.middleware.cors import CORSMiddleware
from backend.database import create_pool, init_db

# Start the database pool on startup, close it on shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_pool = await create_pool()
    await init_db(app.state.db_pool)
    yield
    await app.state.db_pool.close()

app = FastAPI(title='Task Manager API', lifespan=lifespan)  

# Allow requests from the React frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Dependency that retrieves the database pool from app state
def get_pool(request : Request):
    return request.app.state.db_pool

# Health check endpoint to verify database connectivity
@app.get('/api/health')
async def health_check(pool=Depends(get_pool)):
    async with pool.acquire() as conn:
        await conn.fetchval('SELECT 1')
    return {'status': 'ok'}

app.include_router(task_routes.router, prefix='/api')
app.include_router(user_routes.router, prefix='/api')