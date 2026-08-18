import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read the database connection string
DATABASE_URL = os.getenv('DATABASE_URL')

async def create_pool():
    # Create a reusable connection pool for PostgreSQL
    return await asyncpg.create_pool(DATABASE_URL)

async def init_db(pool):
    async with pool.acquire() as conn:  # Get a connection from the pool
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                email VARCHAR UNIQUE NOT NULL,
                role VARCHAR NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                description TEXT,
                status VARCHAR DEFAULT 'pending',
                priority VARCHAR DEFAULT 'medium',
                assigned_to INTEGER REFERENCES users(id),
                due_date DATE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id),
                comment TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        ''')
    print('Database tables created successfully')