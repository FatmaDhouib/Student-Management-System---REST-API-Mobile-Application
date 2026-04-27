const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  etudiants: {
    getAll: () => fetchApi('/etudiants'),
    getOne: (id: string | number) => fetchApi(`/etudiants/${id}`),
    create: (data: any) => fetchApi('/etudiants', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) => fetchApi(`/etudiants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => fetchApi(`/etudiants/${id}`, { method: 'DELETE' }),
  },
  departements: {
    getAll: () => fetchApi('/departements'),
    getOne: (id: string | number) => fetchApi(`/departements/${id}`),
    create: (data: any) => fetchApi('/departements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) => fetchApi(`/departements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => fetchApi(`/departements/${id}`, { method: 'DELETE' }),
  },
};
