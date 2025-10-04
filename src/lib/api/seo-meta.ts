// SEO Meta API - Basic Meta Options
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface SEOMetaData {
  id?: number;
  page_url: string;
  title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url?: string;
  robots?: string;
  created_at?: string;
  updated_at?: string;
}

export const seoMetaAPI = {
  // Get all SEO meta data
  getAll: async (token: string): Promise<SEOMetaData[]> => {
    const response = await fetch(`${API_BASE_URL}/meta`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SEO meta data');
    }

    return response.json();
  },

  // Get SEO meta data by page URL
  getByPage: async (token: string, pageUrl: string): Promise<SEOMetaData> => {
    const response = await fetch(`${API_BASE_URL}/meta/page/${encodeURIComponent(pageUrl)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SEO meta data for page');
    }

    return response.json();
  },

  // Create new SEO meta data
  create: async (token: string, data: Omit<SEOMetaData, 'id' | 'created_at' | 'updated_at'>): Promise<SEOMetaData> => {
    const response = await fetch(`${API_BASE_URL}/meta`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create SEO meta data');
    }

    return response.json();
  },

  // Update SEO meta data
  update: async (token: string, id: number, data: Partial<SEOMetaData>): Promise<SEOMetaData> => {
    const response = await fetch(`${API_BASE_URL}/meta/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update SEO meta data');
    }

    return response.json();
  },

  // Delete SEO meta data
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/meta/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete SEO meta data');
    }
  },

  // Bulk update SEO meta data
  bulkUpdate: async (token: string, updates: Array<{id: number, data: Partial<SEOMetaData>}>): Promise<SEOMetaData[]> => {
    const response = await fetch(`${API_BASE_URL}/meta/bulk`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updates })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk update SEO meta data');
    }

    return response.json();
  }
};