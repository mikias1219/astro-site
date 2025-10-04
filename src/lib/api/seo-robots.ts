// SEO Robots API - Robots.txt and Sitemap Management
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface RobotsData {
  id?: number;
  robots_content: string;
  sitemap_url?: string;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SitemapData {
  id?: number;
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  created_at?: string;
  updated_at?: string;
}

export const seoRobotsAPI = {
  // Get robots.txt data
  getRobots: async (token: string): Promise<RobotsData> => {
    const response = await fetch(`${API_BASE_URL}/robots`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch robots.txt data');
    }

    return response.json();
  },

  // Update robots.txt
  updateRobots: async (token: string, data: Omit<RobotsData, 'id' | 'created_at' | 'updated_at'>): Promise<RobotsData> => {
    const response = await fetch(`${API_BASE_URL}/robots`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update robots.txt');
    }

    return response.json();
  },

  // Get sitemap data
  getSitemap: async (token: string): Promise<SitemapData[]> => {
    const response = await fetch(`${API_BASE_URL}/sitemap`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sitemap data');
    }

    return response.json();
  },

  // Add sitemap entry
  addSitemapEntry: async (token: string, data: Omit<SitemapData, 'id' | 'created_at' | 'updated_at'>): Promise<SitemapData> => {
    const response = await fetch(`${API_BASE_URL}/sitemap`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add sitemap entry');
    }

    return response.json();
  },

  // Update sitemap entry
  updateSitemapEntry: async (token: string, id: number, data: Partial<SitemapData>): Promise<SitemapData> => {
    const response = await fetch(`${API_BASE_URL}/sitemap/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update sitemap entry');
    }

    return response.json();
  },

  // Delete sitemap entry
  deleteSitemapEntry: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/sitemap/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete sitemap entry');
    }
  },

  // Generate sitemap XML
  generateSitemap: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/sitemap/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate sitemap');
    }

    return response.text();
  }
};