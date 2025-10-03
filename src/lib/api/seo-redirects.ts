// SEO Redirects API - Extra SEO Tools (Redirect Manager)
const API_BASE_URL = 'http://localhost:8000/api/admin/seo';

export interface RedirectData {
  id?: number;
  from_url: string;
  to_url: string;
  redirect_type: 301 | 302 | 303 | 307 | 308;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RedirectRule {
  id?: number;
  pattern: string;
  replacement: string;
  redirect_type: 301 | 302 | 303 | 307 | 308;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const seoRedirectsAPI = {
  // Get all redirects
  getAll: async (token: string): Promise<RedirectData[]> => {
    const response = await fetch(`${API_BASE_URL}/redirects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch redirects');
    }
    
    return response.json();
  },

  // Add redirect
  add: async (token: string, data: Omit<RedirectData, 'id' | 'created_at' | 'updated_at'>): Promise<RedirectData> => {
    const response = await fetch(`${API_BASE_URL}/redirects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add redirect');
    }
    
    return response.json();
  },

  // Update redirect
  update: async (token: string, id: number, data: Partial<RedirectData>): Promise<RedirectData> => {
    const response = await fetch(`${API_BASE_URL}/redirects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update redirect');
    }
    
    return response.json();
  },

  // Delete redirect
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/redirects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete redirect');
    }
  },

  // Test redirect
  testRedirect: async (token: string, fromUrl: string): Promise<{
    found: boolean;
    redirect?: {
      to_url: string;
      redirect_type: number;
      status: string;
    };
  }> => {
    const response = await fetch(`${API_BASE_URL}/redirects/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from_url: fromUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to test redirect');
    }
    
    return response.json();
  },

  // Bulk import redirects
  bulkImport: async (token: string, redirects: Array<{
    from_url: string;
    to_url: string;
    redirect_type: 301 | 302 | 303 | 307 | 308;
    description?: string;
  }>): Promise<{
    success_count: number;
    failed_count: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
  }> => {
    const response = await fetch(`${API_BASE_URL}/redirects/bulk-import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ redirects })
    });
    
    if (!response.ok) {
      throw new Error('Failed to bulk import redirects');
    }
    
    return response.json();
  },

  // Export redirects
  export: async (token: string, format: 'csv' | 'json' = 'csv'): Promise<{download_url: string}> => {
    const response = await fetch(`${API_BASE_URL}/redirects/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export redirects');
    }
    
    return response.json();
  },

  // Get redirect rules (regex patterns)
  getRules: async (token: string): Promise<RedirectRule[]> => {
    const response = await fetch(`${API_BASE_URL}/redirects/rules`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch redirect rules');
    }
    
    return response.json();
  },

  // Add redirect rule
  addRule: async (token: string, data: Omit<RedirectRule, 'id' | 'created_at' | 'updated_at'>): Promise<RedirectRule> => {
    const response = await fetch(`${API_BASE_URL}/redirects/rules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add redirect rule');
    }
    
    return response.json();
  },

  // Update redirect rule
  updateRule: async (token: string, id: number, data: Partial<RedirectRule>): Promise<RedirectRule> => {
    const response = await fetch(`${API_BASE_URL}/redirects/rules/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update redirect rule');
    }
    
    return response.json();
  },

  // Delete redirect rule
  deleteRule: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/redirects/rules/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete redirect rule');
    }
  },

  // Test redirect rule
  testRule: async (token: string, pattern: string, testUrl: string): Promise<{
    matches: boolean;
    result_url?: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/redirects/rules/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pattern, test_url: testUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to test redirect rule');
    }
    
    return response.json();
  }
};
