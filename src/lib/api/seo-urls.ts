// SEO URLs API - URL Management and Optimization
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface URLData {
  id?: number;
  original_url: string;
  optimized_url?: string;
  url_status: 'active' | 'redirect' | 'broken';
  last_checked?: string;
  seo_score?: number;
  issues?: string[];
  created_at?: string;
  updated_at?: string;
}

export const seoUrlsAPI = {
  // Get all URL data
  getAll: async (token: string): Promise<URLData[]> => {
    const response = await fetch(`${API_BASE_URL}/urls`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL data');
    }

    return response.json();
  },

  // Analyze URL
  analyze: async (token: string, url: string): Promise<URLData> => {
    const response = await fetch(`${API_BASE_URL}/urls/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze URL');
    }

    return response.json();
  },

  // Update URL data
  update: async (token: string, id: number, data: Partial<URLData>): Promise<URLData> => {
    const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update URL data');
    }

    return response.json();
  },

  // Bulk analyze URLs
  bulkAnalyze: async (token: string, urls: string[]): Promise<URLData[]> => {
    const response = await fetch(`${API_BASE_URL}/urls/bulk-analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ urls })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk analyze URLs');
    }

    return response.json();
  }
};