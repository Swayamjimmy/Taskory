const API_BASE = 'http://127.0.0.1:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Keep the default error message if response isn't JSON
    }

    throw new Error(message);
  }
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildQueryParams(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export const api = {

  getTasks: (params = {}) => {
    const query = buildQueryParams(params);
    return request(`/tasks${query}`);
  },

  getTask: (id) => {
    return request(`/tasks/${id}`);
  },

  createTask: (data) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: (id, data) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTask: (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  getUsers: () => {
    return request('/users');
  },

  createUser: (data) => {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getComments: (taskId) => {
    return request(`/tasks/${taskId}/comments`);
  },

  addComment: (taskId, data) => {
    return request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getDashboard: () => {
    return request('/dashboard');
  },

  getExternalUsers: () => {
    return request('/external/users');
  },

  seed: () => {
    return request('/seed', {
      method: 'POST',
    });
  },
};