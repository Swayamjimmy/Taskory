class UserRepository:
    def __init__(self, pool):
        self.pool = pool

    async def get_all(self):
        return await self.pool.fetch('SELECT * FROM users ORDER BY created_at DESC')

    async def create(self, data):
        # RETURNING * gives back the created user row
        return await self.pool.fetchrow(
            'INSERT INTO users (name, email, role) VALUES ($1,$2,$3) RETURNING *',
            data.name, data.email, data.role
        )