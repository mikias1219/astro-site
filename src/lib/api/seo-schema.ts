// SEO Schema API - Structured Data Management
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface SchemaData {
  id?: number;
  page_url: string;
  schema_type: string;
  schema_data: any;
  created_at?: string;
  updated_at?: string;
}

export const seoSchemaAPI = {
  // Get all schema data
  getAll: async (token: string): Promise<SchemaData[]> => {
    const response = await fetch(`${API_BASE_URL}/schema`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch schema data');
    }

    return response.json();
  },

  // Create new schema data
  create: async (token: string, data: Omit<SchemaData, 'id' | 'created_at' | 'updated_at'>): Promise<SchemaData> => {
    const response = await fetch(`${API_BASE_URL}/schema`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create schema data');
    }

    return response.json();
  },

  // Update schema data
  update: async (token: string, id: number, data: Partial<SchemaData>): Promise<SchemaData> => {
    const response = await fetch(`${API_BASE_URL}/schema/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update schema data');
    }

    return response.json();
  },

  // Delete schema data
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/schema/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete schema data');
    }
  }
};