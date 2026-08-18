class TaskRepository:
    def __init__(self, pool):
        self.pool = pool

    async def get_all(
        self,
        status=None,
        priority=None,
        assignee=None,
        search=None,
        page=1,
        limit=10,
        sort_by='created_at',
        sort_order='desc'
    ):
        # Build WHERE clauses dynamically based on active filters
        conditions = []
        params = []
        idx = 1

        if status:
            conditions.append(f'status = ${idx}')
            params.append(status)
            idx += 1

        if priority:
            conditions.append(f'priority = ${idx}')
            params.append(priority)
            idx += 1

        if assignee:
            conditions.append(f'assigned_to = ${idx}')
            params.append(assignee)
            idx += 1

        if search:
            conditions.append(f'title ILIKE ${idx}')
            params.append(f'%{search}%')
            idx += 1

        where = 'WHERE ' + ' AND '.join(conditions) if conditions else ''

        # Only allow known database columns to be used for sorting.
        # This prevents SQL injection through sort_by.
        allowed_sort_fields = {
            'created_at': 'created_at',
            'updated_at': 'updated_at',
            'due_date': 'due_date',
            'title': 'title',
            'priority': 'priority',
            'status': 'status',
        }

        sort_column = allowed_sort_fields.get(sort_by, 'created_at')

        # Only allow ASC or DESC.
        sort_direction = 'ASC' if sort_order.lower() == 'asc' else 'DESC'

        # Get total count for pagination metadata
        count_query = f'SELECT COUNT(*) FROM tasks {where}'
        total = await self.pool.fetchval(count_query, *params)

        offset = (page - 1) * limit

        data_query = f'''
            SELECT
                tasks.*,
                users.name AS assignee_name
            FROM tasks
            LEFT JOIN users
                ON tasks.assigned_to = users.id
            {where}
            ORDER BY {sort_column} {sort_direction}
            LIMIT ${idx}
            OFFSET ${idx + 1}
        '''

        rows = await self.pool.fetch(
            data_query,
            *params,
            limit,
            offset
        )

        return rows, total

    async def get_by_id(self, task_id):
        return await self.pool.fetchrow('SELECT * FROM tasks WHERE id = $1', task_id)

    async def create(self, data):
        # INSERT ... RETURNING * gives back the created row
        return await self.pool.fetchrow(
            'INSERT INTO tasks (title, description, status, priority, assigned_to, due_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            data.title, data.description, data.status, data.priority, data.assigned_to, data.due_date
        )

    async def update(self, task_id, data):
        # COALESCE keeps existing values for fields not provided
        return await self.pool.fetchrow(
            'UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description), status=COALESCE($3,status), priority=COALESCE($4,priority), assigned_to=COALESCE($5,assigned_to), due_date=COALESCE($6,due_date), updated_at=NOW() WHERE id=$7 RETURNING *',
            data.title, data.description, data.status, data.priority, data.assigned_to, data.due_date, task_id
        )

    async def delete(self, task_id):
        await self.pool.execute('DELETE FROM tasks WHERE id = $1', task_id)