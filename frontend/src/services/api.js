const BASE_URL = 'http://127.0.0.1:8000';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getDashboard: () => apiFetch('/api/dashboard'),
  getTasks: (params) => apiFetch(`/api/tasks?${new URLSearchParams(params)}`),
  getTask: (id) => apiFetch(`/api/tasks/${id}`),
  createTask: (data) => apiFetch('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => apiFetch(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => apiFetch(`/api/tasks/${id}`, { method: 'DELETE' }),
  getUsers: () => apiFetch('/api/users'),
  createUser: (data) => apiFetch('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  getComments: (taskId) => apiFetch(`/api/tasks/${taskId}/comments`),
  addComment: (taskId, data) => apiFetch(`/api/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify(data) }),
};