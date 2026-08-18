from fastapi import APIRouter, Depends, Request, HTTPException
from backend.schemas.task_schemas import TaskCreate, TaskUpdate, PaginatedResponse
from backend.repositories.task_repository import TaskRepository
from backend.repositories.user_repository import UserRepository
import math

router = APIRouter()

def get_pool(request: Request):
    return request.app.state.db_pool

# List tasks with optional filtering, search, and pagination
@router.get('/tasks')
async def list_tasks(status=None, priority=None, assignee=None, search=None, page=1, limit=10, pool=Depends(get_pool)):
    repo = TaskRepository(pool)
    rows, total = await repo.get_all(status, priority, assignee, search, int(page), int(limit))
    return {'items': [dict(r) for r in rows], 'total': total, 'page': int(page), 'limit': int(limit), 'pages': math.ceil(total / int(limit))}

# Get a single task by ID
@router.get('/tasks/{task_id}')
async def get_task(task_id: int, pool=Depends(get_pool)):
    repo = TaskRepository(pool)
    row = await repo.get_by_id(task_id)
    if not row:
        raise HTTPException(status_code=404, detail='Task not found')
    return dict(row)

# Create a new task and return the created record
@router.post('/tasks', status_code=201)
async def create_task(data: TaskCreate, pool=Depends(get_pool)):
    repo = TaskRepository(pool)
    row = await repo.create(data)
    return dict(row)

# Update an existing task by ID
@router.put('/tasks/{task_id}')
async def update_task(task_id: int, data: TaskUpdate, pool=Depends(get_pool)):
    repo = TaskRepository(pool)
    row = await repo.update(task_id, data)
    if not row:
        raise HTTPException(status_code=404, detail='Task not found')
    return dict(row)

# Delete a task by ID
@router.delete('/tasks/{task_id}', status_code=204)
async def delete_task(task_id: int, pool=Depends(get_pool)):
    repo = TaskRepository(pool)
    await repo.delete(task_id)

# Populate the database with sample users and tasks
@router.post('/seed', status_code=201)
async def seed_database(pool=Depends(get_pool)):
    user_repo = UserRepository(pool)
    users_data = [
        ('Alice Johnson', 'alice@example.com', 'developer'),
        ('Bob Smith', 'bob@example.com', 'designer'),
        ('Carol White', 'carol@example.com', 'manager'),
        ('David Brown', 'david@example.com', 'developer'),
        ('Eve Davis', 'eve@example.com', 'qa'),
    ]
    await pool.executemany('INSERT INTO users (name, email, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', users_data)
    users = await pool.fetch('SELECT id FROM users LIMIT 5')
    user_ids = [u['id'] for u in users]
    tasks_data = []
    statuses = ['pending','in_progress','completed','blocked']
    priorities = ['low','medium','high','urgent']
    for i in range(20):
        tasks_data.append((f'Task {i+1}', f'Description for task {i+1}', statuses[i%4], priorities[i%4], user_ids[i%len(user_ids)], None))
    await pool.executemany('INSERT INTO tasks (title, description, status, priority, assigned_to, due_date) VALUES ($1,$2,$3,$4,$5,$6)', tasks_data)
    return {'message': 'Database seeded successfully'}

@router.post('/tasks/{task_id}/comments', status_code=201)
async def add_comment(task_id: int, body: dict, pool=Depends(get_pool)):
    # Insert the comment and return the created row
    row = await pool.fetchrow(
        'INSERT INTO comments (task_id, user_id, comment) VALUES ($1,$2,$3) RETURNING *',
        task_id, body.get('user_id'), body.get('comment')
    )
    return dict(row)

@router.get('/tasks/{task_id}/comments')
async def get_comments(task_id: int, pool=Depends(get_pool)):
    # Join with users table to include the commenter's name
    rows = await pool.fetch(
        'SELECT c.*, u.name as user_name FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.task_id = $1 ORDER BY c.created_at DESC',
        task_id
    )
    return [dict(r) for r in rows]