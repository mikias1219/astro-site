// SEO Analytics API - Analytics & Tracking
const API_BASE_URL = 'http://localhost:8000/api/admin/seo';

export interface AnalyticsData {
  id?: number;
  service: 'google_analytics' | 'google_search_console' | 'facebook_pixel' | 'other';
  tracking_id: string;
  measurement_id?: string;
  property_id?: string;
  is_active: boolean;
  config: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsReport {
  date_range: string;
  total_visitors: number;
  total_page_views: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{
    page: string;
    views: number;
    unique_visitors: number;
  }>;
  top_keywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  device_breakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  traffic_sources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
  };
}

export const seoAnalyticsAPI = {
  // Get all analytics configurations
  getAll: async (token: string): Promise<AnalyticsData[]> => {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    
    return response.json();
  },

  // Add analytics configuration
  add: async (token: string, data: Omit<AnalyticsData, 'id' | 'created_at' | 'updated_at'>): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add analytics configuration');
    }
    
    return response.json();
  },

  // Update analytics configuration
  update: async (token: string, id: number, data: Partial<AnalyticsData>): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/analytics/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update analytics configuration');
    }
    
    return response.json();
  },

  // Delete analytics configuration
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/analytics/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete analytics configuration');
    }
  },

  // Test analytics connection
  testConnection: async (token: string, service: string, trackingId: string): Promise<{success: boolean, message: string}> => {
    const response = await fetch(`${API_BASE_URL}/analytics/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ service, tracking_id: trackingId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to test analytics connection');
    }
    
    return response.json();
  },

  // Get analytics report
  getReport: async (token: string, dateRange: string = '30d'): Promise<AnalyticsReport> => {
    const response = await fetch(`${API_BASE_URL}/analytics/report?range=${dateRange}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics report');
    }
    
    return response.json();
  },

  // Get Google Search Console data
  getSearchConsoleData: async (token: string, dateRange: string = '30d'): Promise<{
    total_clicks: number;
    total_impressions: number;
    average_ctr: number;
    average_position: number;
    top_queries: Array<{
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
    top_pages: Array<{
      page: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
  }> => {
    const response = await fetch(`${API_BASE_URL}/analytics/search-console?range=${dateRange}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Search Console data');
    }
    
    return response.json();
  },

  // Generate tracking code
  generateTrackingCode: async (token: string, service: string): Promise<{code: string}> => {
    const response = await fetch(`${API_BASE_URL}/analytics/generate-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ service })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate tracking code');
    }
    
    return response.json();
  }
};
