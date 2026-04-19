const BASE_URL = 'http://localhost:3001';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
