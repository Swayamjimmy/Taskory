from fastapi import APIRouter, Depends, Request

router = APIRouter()

def get_pool(request: Request):
    return request.app.state.db_pool

@router.get('/dashboard')
async def get_dashboard(pool=Depends(get_pool)):
    # Compute all status counts and overdue count in a single query
    row = await pool.fetchrow('''
        SELECT
            COUNT(*) as total_tasks,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'blocked') as blocked,
            COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'completed') as overdue
        FROM tasks
    ''')
    return dict(row)