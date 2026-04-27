const BASE_URL = 'http://localhost:8080/api';

export const departementService = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/departements`);
    if (!response.ok) throw new Error('Failed to fetch departements');
    return response.json();
  },
  getById: async (id: number) => {
    const response = await fetch(`${BASE_URL}/departements/${id}`);
    if (!response.ok) throw new Error('Failed to fetch departement');
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch(`${BASE_URL}/departements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create departement');
    return response.json();
  },
  update: async (id: number, data: any) => {
    const response = await fetch(`${BASE_URL}/departements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update departement');
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${BASE_URL}/departements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete departement');
  },
};

export const etudiantService = {
  getAll: async (annee?: number, deptId?: number) => {
    let url = `${BASE_URL}/etudiants`;
    const params = new URLSearchParams();
    if (annee !== undefined) params.append('annee', annee.toString());
    if (deptId !== undefined) params.append('deptId', deptId.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch etudiants');
    return response.json();
  },
  getById: async (id: number) => {
    const response = await fetch(`${BASE_URL}/etudiants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch etudiant');
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch(`${BASE_URL}/etudiants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create etudiant');
    return response.json();
  },
  update: async (id: number, data: any) => {
    const response = await fetch(`${BASE_URL}/etudiants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update etudiant');
    return response.json();
  },
  delete: async (id: number) => {
    const response = await fetch(`${BASE_URL}/etudiants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete etudiant');
  },
};
