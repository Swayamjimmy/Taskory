# Taskory

Taskory is a full-stack task management dashboard built with React and FastAPI. It provides task CRUD operations, filtering and search, pagination, a Kanban board, task comments, dashboard statistics, user assignment, an external team directory, and light/dark theme support.

The application is divided into two main parts:

* **Frontend:** React application powered by Vite and Tailwind CSS.
* **Backend:** FastAPI application using asynchronous PostgreSQL access through `asyncpg`.

The backend follows a repository-based structure, separating API routes, database access, schemas, and external API services.

---

## Features

* Task creation, editing, viewing, and deletion
* Task status management:

  * Pending
  * In Progress
  * Completed
  * Blocked
* Task priority levels:

  * Low
  * Medium
  * High
  * Urgent
* Task assignment to users
* Due dates
* Task search by title
* Filtering by status, priority, and assignee
* Pagination with total task/page metadata
* Kanban board with drag-and-drop status updates
* Mobile-friendly status selection on the Kanban board
* Task comments
* Dashboard statistics
* Overdue task calculation
* User creation and listing
* External user/team directory
* Five-minute in-memory cache for the external API
* Light/dark mode with localStorage persistence
* Toast notifications for frontend operations

The frontend routes include Dashboard, Tasks, Task Details, Kanban, and Team views.

---

## Tech Stack

### Frontend

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| React 19            | UI development                    |
| React DOM           | React rendering                   |
| Vite 8              | Development server and build tool |
| React Router DOM 7  | Client-side routing               |
| Tailwind CSS 4      | Styling                           |
| `@tailwindcss/vite` | Tailwind/Vite integration         |
| React Hot Toast     | Success/error notifications       |
| ESLint              | Code linting                      |

The versions above are taken from the project's `package.json`.

### Backend

| Technology    | Purpose                             |
| ------------- | ----------------------------------- |
| Python        | Backend language                    |
| FastAPI       | REST API framework                  |
| asyncpg       | Asynchronous PostgreSQL driver      |
| Pydantic      | Request/data validation             |
| python-dotenv | Loading environment variables       |
| httpx         | Asynchronous external HTTP requests |
| PostgreSQL    | Relational database                 |

The backend uses an asynchronous connection pool and keeps the pool in FastAPI application state.

---

## Project Structure

```text
swayamjimmy-taskory/
├── backend/
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── task_repository.py
│   │   └── user_repository.py
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── dashboard_routes.py
│   │   ├── external_routes.py
│   │   ├── task_routes.py
│   │   └── user_routes.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task_schemas.py
│   │   └── user_schemas.py
│   │
│   └── services/
│       └── external_api.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    │
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── main.jsx
        │
        ├── components/
        │   ├── ExternalUsers.jsx
        │   ├── Modal.jsx
        │   ├── Pagination.jsx
        │   ├── PriorityBadge.jsx
        │   ├── StatCard.jsx
        │   ├── StatusBadge.jsx
        │   └── TaskFormModal.jsx
        │
        ├── context/
        │   └── ThemeContext.jsx
        │
        ├── pages/
        │   ├── DashboardPage.jsx
        │   ├── KanbanPage.jsx
        │   ├── TaskDetailPage.jsx
        │   └── TaskListPage.jsx
        │
        └── services/
            └── api.js
```

This structure is reflected in the supplied project source.

---

# Setup Instructions

## Prerequisites

Install the following before running the application:

* Python 3.x
* Node.js and npm
* PostgreSQL
* Git

The repository does not contain a backend `requirements.txt` or equivalent dependency manifest in the supplied source, so the backend Python dependencies need to be installed manually.

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd swayamjimmy-taskory
```

---

# Environment Variables

The backend reads its configuration from a `.env` file using `python-dotenv`.

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskory
```

`DATABASE_URL` is the only environment variable explicitly read by the supplied backend code.

### Important frontend configuration

The frontend does **not** currently read its API URL from an environment variable.

The API base URL is hardcoded in:

```text
frontend/src/services/api.js
```

as:

```javascript
const API_BASE = 'http://127.0.0.1:8000/api';
```

Therefore, no frontend `.env` variable is required for the current implementation.

If the backend is deployed somewhere else, this value must currently be changed in `api.js`.

---

# Database Setup

Taskory uses PostgreSQL.

## 1. Create the Database

For example:

```bash
createdb taskory
```

Or from `psql`:

```sql
CREATE DATABASE taskory;
```

## 2. Configure `DATABASE_URL`

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskory
```

## 3. Database Tables

The backend automatically creates the required tables when the application starts.

No separate migration script is included in the supplied project.

The following tables are created:

### `users`

| Column       | Type        | Description        |
| ------------ | ----------- | ------------------ |
| `id`         | SERIAL      | Primary key        |
| `name`       | VARCHAR     | User name          |
| `email`      | VARCHAR     | Unique email       |
| `role`       | VARCHAR     | User role          |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### `tasks`

| Column        | Type        | Description               |
| ------------- | ----------- | ------------------------- |
| `id`          | SERIAL      | Primary key               |
| `title`       | VARCHAR     | Task title                |
| `description` | TEXT        | Task description          |
| `status`      | VARCHAR     | Task status               |
| `priority`    | VARCHAR     | Task priority             |
| `assigned_to` | INTEGER     | Foreign key to `users.id` |
| `due_date`    | DATE        | Optional due date         |
| `created_at`  | TIMESTAMPTZ | Creation timestamp        |
| `updated_at`  | TIMESTAMPTZ | Last update timestamp     |

### `comments`

| Column       | Type        | Description               |
| ------------ | ----------- | ------------------------- |
| `id`         | SERIAL      | Primary key               |
| `task_id`    | INTEGER     | Foreign key to `tasks.id` |
| `user_id`    | INTEGER     | Foreign key to `users.id` |
| `comment`    | TEXT        | Comment content           |
| `created_at` | TIMESTAMPTZ | Creation timestamp        |

The `comments.task_id` foreign key uses `ON DELETE CASCADE`, meaning comments are automatically deleted when their task is deleted.

### Automatic initialization

When FastAPI starts, it:

1. Creates the PostgreSQL connection pool.
2. Creates the tables if they do not already exist.
3. Starts serving requests.
4. Closes the connection pool when the application shuts down.

---

# Backend Setup

From the project root:

```bash
cd backend
```

Create and activate a virtual environment:

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn asyncpg python-dotenv httpx pydantic
```

The project imports these packages directly in its backend implementation.

---

# How to Run Backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

Or:

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

The backend exposes its FastAPI application as `app` in `backend/main.py`.

---

# Seed Sample Data

After starting the backend, sample data can be inserted using:

```bash
curl -X POST http://127.0.0.1:8000/api/seed
```

The seed endpoint creates:

* 5 sample users
* 20 sample tasks

The sample users are Alice Johnson, Bob Smith, Carol White, David Brown, and Eve Davis. Tasks are distributed across the four supported statuses and four supported priorities.

---

# How to Run Frontend

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend is configured to use Vite and its development server. The project's package scripts include `dev`, `build`, `lint`, and `preview`.

The frontend is expected to run at:

```text
http://localhost:5173
```

The backend explicitly allows this origin through CORS.

---

# Frontend Commands

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview production build

```bash
npm run preview
```

---

# API Documentation

All application API endpoints are prefixed with:

```text
/api
```

Base URL:

```text
http://127.0.0.1:8000/api
```

---

## Health Check

### `GET /api/health`

Checks whether the backend can successfully communicate with PostgreSQL.

### Response

```json
{
  "status": "ok"
}
```

---

# Tasks API

## List Tasks

### `GET /api/tasks`

Returns a paginated list of tasks.

### Query Parameters

| Parameter  | Type    | Default | Description                |
| ---------- | ------- | ------: | -------------------------- |
| `status`   | string  |       — | Filter by status           |
| `priority` | string  |       — | Filter by priority         |
| `assignee` | integer |       — | Filter by assigned user ID |
| `search`   | string  |       — | Search task titles         |
| `page`     | integer |     `1` | Page number                |
| `limit`    | integer |    `10` | Number of tasks per page   |

Example:

```text
GET /api/tasks?page=1&limit=10&status=pending
```

The backend calculates the offset from `(page - 1) * limit` and returns pagination metadata including `total`, `page`, `limit`, and `pages`.

### Response

```json
{
  "items": [
    {
      "id": 1,
      "title": "Example task",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "assigned_to": 1,
      "due_date": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "pages": 2
}
```

---

## Get Task

### `GET /api/tasks/{task_id}`

Returns a single task.

Example:

```text
GET /api/tasks/1
```

If the task does not exist:

```json
{
  "detail": "Task not found"
}
```

with HTTP status `404`.

---

## Create Task

### `POST /api/tasks`

Creates a new task.

### Request Body

```json
{
  "title": "Implement authentication",
  "description": "Add authentication to the application",
  "status": "pending",
  "priority": "high",
  "assigned_to": 1,
  "due_date": "2026-09-01"
}
```

### Supported Status Values

```text
pending
in_progress
completed
blocked
```

### Supported Priority Values

```text
low
medium
high
urgent
```

`title` is required. The other task fields have defaults or are optional according to the Pydantic schema.

Returns HTTP `201`.

---

## Update Task

### `PUT /api/tasks/{task_id}`

Updates an existing task.

Example:

```text
PUT /api/tasks/1
```

Request:

```json
{
  "status": "completed",
  "priority": "high"
}
```

All fields in the update schema are optional.

The repository uses SQL `COALESCE`, so omitted fields retain their existing values.

Returns HTTP `404` if the task does not exist.

---

## Delete Task

### `DELETE /api/tasks/{task_id}`

Deletes a task.

Example:

```text
DELETE /api/tasks/1
```

Returns:

```text
204 No Content
```

The frontend API wrapper also explicitly handles the empty `204` response.

---

# Task Comments API

## Add Comment

### `POST /api/tasks/{task_id}/comments`

Request body:

```json
{
  "user_id": 1,
  "comment": "This task is ready for review."
}
```

Returns HTTP `201`.

The endpoint inserts the comment into the `comments` table and returns the created record.

---

## Get Comments

### `GET /api/tasks/{task_id}/comments`

Returns comments associated with a task.

The response includes the commenter's name through a SQL join with the `users` table.

Example:

```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 2,
    "comment": "Looks good.",
    "created_at": "...",
    "user_name": "Bob Smith"
  }
]
```

Comments are ordered newest first.

---

# Users API

## List Users

### `GET /api/users`

Returns all users ordered by creation time.

Example:

```text
GET /api/users
```

---

## Create User

### `POST /api/users`

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer"
}
```

Returns HTTP `201`.

The user schema requires `name`, `email`, and `role`.

---

# Dashboard API

## `GET /api/dashboard`

Returns aggregate task statistics.

### Response

```json
{
  "total_tasks": 20,
  "pending": 5,
  "in_progress": 5,
  "completed": 5,
  "blocked": 5,
  "overdue": 0
}
```

The `overdue` count includes tasks whose due date is before the current date and whose status is not `completed`.

---

# External Users API

## `GET /api/external/users`

Retrieves users from the external JSONPlaceholder API.

The backend requests:

```text
https://jsonplaceholder.typicode.com/users
```

The result is cached in memory for five minutes to avoid making the external request on every call.

The external service uses `httpx.AsyncClient` with a 10-second timeout and handles timeout and HTTP status errors.

---

# Frontend Pages

## Dashboard

Route:

```text
/
```

Displays:

* Total tasks
* Pending tasks
* In-progress tasks
* Completed tasks
* Blocked tasks
* Overdue tasks

The dashboard retrieves its data from `/api/dashboard`.

---

## Tasks

Route:

```text
/tasks
```

Provides the task list interface with:

* Task search
* Filtering
* Pagination
* Task creation
* Task editing
* Task navigation
* Assignee display

The pagination component calculates the number of pages from `total / limit` and prevents navigation outside the valid page range.

---

## Task Details

Route:

```text
/tasks/:id
```

Provides detailed information about an individual task, including:

* Status
* Priority
* Due date
* Description
* Editing
* Deletion
* Comments

---

## Kanban

Route:

```text
/kanban
```

The Kanban board contains four columns:

```text
Pending
In Progress
Completed
Blocked
```

Tasks can be dragged between columns on desktop, which updates the task status through the backend API. A dropdown provides a mobile fallback.

---

## Team

Route:

```text
/team
```

Displays users retrieved from the external API.

---

# Dark Mode

Taskory supports light and dark themes.

The theme system:

1. Checks `localStorage` for a previously selected theme.
2. Falls back to the user's system preference.
3. Defaults to light mode.
4. Stores the selected theme in `localStorage`.
5. Adds/removes the `dark` class on the document root.

This behavior is implemented in `ThemeContext.jsx`.

---

# Application Architecture

The backend follows a layered structure:

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
FastAPI Routes
      │
      ▼
Repositories
      │
      ▼
asyncpg Connection Pool
      │
      ▼
PostgreSQL
```

For external users:

```text
React Frontend
      │
      ▼
FastAPI External Route
      │
      ▼
External API Service
      │
      ▼
JSONPlaceholder API
```

The backend separates route handling from database operations using repository classes such as `TaskRepository` and `UserRepository`.

---

# Assumptions

The following assumptions are based strictly on the supplied implementation:

1. **PostgreSQL is already installed and accessible.**
   The application expects a valid PostgreSQL connection string through `DATABASE_URL`.

2. **The backend is run locally on port 8000.**
   The frontend API service currently hardcodes `http://127.0.0.1:8000/api`.

3. **The frontend is run on Vite's default development origin.**
   The backend CORS configuration explicitly allows `http://localhost:5173`.

4. **Database initialization is handled by the application itself.**
   There is no separate migration system in the supplied source; `CREATE TABLE IF NOT EXISTS` statements execute during application startup.

5. **Authentication and authorization are not implemented.**
   The supplied routes do not contain authentication middleware, login endpoints, tokens, sessions, or role-based authorization.

7. **The external team directory depends on JSONPlaceholder being reachable.**
   The backend makes an outbound HTTP request when its five-minute in-memory cache is stale.

8. **The external-user cache is process-local.**
   Because it is stored in a Python in-memory dictionary, the cache is not shared between multiple backend processes or servers.

9. **The seed endpoint is intended for development/demo data.**
   Calling `/api/seed` creates sample users and 20 sample tasks and should not be treated as a production data migration mechanism.

---

# Quick Start

### Terminal 1 — Backend

```bash
cd swayamjimmy-taskory

python3 -m venv .venv
source .venv/bin/activate

pip install fastapi uvicorn asyncpg python-dotenv httpx pydantic

cd backend
# Create .env containing DATABASE_URL

cd ..
uvicorn backend.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd swayamjimmy-taskory/frontend

npm install
npm run dev
```

### Optional — Seed Database

```bash
curl -X POST http://127.0.0.1:8000/api/seed
```

Then open:

```text
http://localhost:5173
```

---

# API Summary

| Method   | Endpoint                        | Purpose                                  |
| -------- | ------------------------------- | ---------------------------------------- |
| `GET`    | `/api/health`                   | Health/database connectivity check       |
| `GET`    | `/api/tasks`                    | List, filter, search, and paginate tasks |
| `GET`    | `/api/tasks/{task_id}`          | Get a task                               |
| `POST`   | `/api/tasks`                    | Create a task                            |
| `PUT`    | `/api/tasks/{task_id}`          | Update a task                            |
| `DELETE` | `/api/tasks/{task_id}`          | Delete a task                            |
| `POST`   | `/api/seed`                     | Insert sample users/tasks                |
| `POST`   | `/api/tasks/{task_id}/comments` | Add a comment                            |
| `GET`    | `/api/tasks/{task_id}/comments` | Get task comments                        |
| `GET`    | `/api/users`                    | List users                               |
| `POST`   | `/api/users`                    | Create a user                            |
| `GET`    | `/api/dashboard`                | Get task statistics                      |
| `GET`    | `/api/external/users`           | Get external users                       |
