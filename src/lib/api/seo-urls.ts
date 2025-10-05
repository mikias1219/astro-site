// SEO URLs API - URL Management and Optimization
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface URLData {
  id?: number;
  // UI fields
  original_url: string; // maps to backend page_url
  optimized_url?: string; // maps to backend custom_slug
  canonical_url?: string;
  url_status: 'active' | 'redirect' | 'broken';
  last_checked?: string;
  seo_score?: number;
  issues?: string[];
  created_at?: string;
  updated_at?: string;
  // Backend-shape (when reading)
  page_url?: string;
  custom_slug?: string;
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

    const list = await response.json();
    // Normalize backend payload to UI shape
    return (list || []).map((item: any) => ({
      ...item,
      original_url: item.original_url ?? item.page_url ?? '',
      optimized_url: item.optimized_url ?? item.custom_slug ?? '',
      canonical_url: item.canonical_url,
    }));
  },

  // Create URL configuration
  create: async (token: string, data: URLData): Promise<URLData> => {
    const payload = {
      page_url: data.original_url,
      custom_slug: data.optimized_url,
      canonical_url: data.canonical_url,
      url_status: data.url_status,
    };
    const response = await fetch(`${API_BASE_URL}/urls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to create URL configuration');
    }

    const created = await response.json();
    return {
      ...created,
      original_url: created.page_url ?? data.original_url,
      optimized_url: created.custom_slug ?? data.optimized_url,
      canonical_url: created.canonical_url ?? data.canonical_url,
      url_status: data.url_status,
    } as URLData;
  },

  // Update URL data
  update: async (token: string, id: number, data: Partial<URLData>): Promise<URLData> => {
    const payload = {
      page_url: data.original_url ?? data.page_url,
      custom_slug: data.optimized_url ?? data.custom_slug,
      canonical_url: data.canonical_url,
      url_status: data.url_status,
    };
    const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to update URL data');
    }

    const updated = await response.json();
    return {
      ...updated,
      original_url: updated.page_url ?? data.original_url ?? '',
      optimized_url: updated.custom_slug ?? data.optimized_url ?? '',
      canonical_url: updated.canonical_url ?? data.canonical_url,
      url_status: data.url_status ?? 'active',
    } as URLData;
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
  },

  // Delete URL configuration
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete URL configuration');
    }
  },

  // Generate slug from title
  generateSlug: async (token: string, title: string): Promise<{ slug: string }> => {
    const response = await fetch(`${API_BASE_URL}/urls/generate-slug`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to generate slug');
    return response.json();
  },

  // Check slug availability
  checkSlug: async (token: string, slug: string): Promise<{ available: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/urls/check-slug`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug })
    });
    if (!response.ok) throw new Error('Failed to check slug');
    return response.json();
  },

  // Set canonical URL for a page
  setCanonical: async (token: string, pageUrl: string, canonicalUrl: string): Promise<URLData> => {
    const response = await fetch(`${API_BASE_URL}/urls/canonical`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_url: pageUrl, canonical_url: canonicalUrl })
    });
    if (!response.ok) throw new Error('Failed to set canonical URL');
    return response.json();
  }
};