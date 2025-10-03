// SEO Performance API - Performance Optimization
const API_BASE_URL = 'http://localhost:8000/api/admin/seo';

export interface PerformanceSettings {
  id?: number;
  minify_css: boolean;
  minify_js: boolean;
  enable_browser_caching: boolean;
  cache_duration: number; // in seconds
  enable_lazy_loading: boolean;
  enable_gzip_compression: boolean;
  enable_cdn: boolean;
  cdn_url?: string;
  enable_preload: boolean;
  preload_resources: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PerformanceReport {
  page_url: string;
  load_time: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  recommendations: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  mobile_performance: {
    load_time: number;
    performance_score: number;
    is_mobile_friendly: boolean;
  };
}

export const seoPerformanceAPI = {
  // Get performance settings
  getSettings: async (token: string): Promise<PerformanceSettings> => {
    const response = await fetch(`${API_BASE_URL}/performance/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch performance settings');
    }
    
    return response.json();
  },

  // Update performance settings
  updateSettings: async (token: string, settings: Partial<PerformanceSettings>): Promise<PerformanceSettings> => {
    const response = await fetch(`${API_BASE_URL}/performance/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update performance settings');
    }
    
    return response.json();
  },

  // Get performance report for a page
  getPageReport: async (token: string, pageUrl: string): Promise<PerformanceReport> => {
    const response = await fetch(`${API_BASE_URL}/performance/report/${encodeURIComponent(pageUrl)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch performance report');
    }
    
    return response.json();
  },

  // Get performance reports for all pages
  getAllReports: async (token: string): Promise<PerformanceReport[]> => {
    const response = await fetch(`${API_BASE_URL}/performance/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch performance reports');
    }
    
    return response.json();
  },

  // Run performance audit
  runAudit: async (token: string, pageUrl: string): Promise<PerformanceReport> => {
    const response = await fetch(`${API_BASE_URL}/performance/audit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_url: pageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to run performance audit');
    }
    
    return response.json();
  },

  // Minify CSS
  minifyCSS: async (token: string, cssContent: string): Promise<{minified_css: string, size_reduction: number}> => {
    const response = await fetch(`${API_BASE_URL}/performance/minify-css`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ css_content: cssContent })
    });
    
    if (!response.ok) {
      throw new Error('Failed to minify CSS');
    }
    
    return response.json();
  },

  // Minify JavaScript
  minifyJS: async (token: string, jsContent: string): Promise<{minified_js: string, size_reduction: number}> => {
    const response = await fetch(`${API_BASE_URL}/performance/minify-js`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ js_content: jsContent })
    });
    
    if (!response.ok) {
      throw new Error('Failed to minify JavaScript');
    }
    
    return response.json();
  },

  // Generate browser caching headers
  generateCachingHeaders: async (token: string, fileTypes: string[]): Promise<Record<string, string>> => {
    const response = await fetch(`${API_BASE_URL}/performance/caching-headers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file_types: fileTypes })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate caching headers');
    }
    
    return response.json();
  },

  // Test mobile responsiveness
  testMobileResponsiveness: async (token: string, pageUrl: string): Promise<{
    is_mobile_friendly: boolean;
    issues: Array<{
      type: string;
      description: string;
      severity: 'error' | 'warning';
    }>;
    screenshots: {
      desktop: string;
      mobile: string;
    };
  }> => {
    const response = await fetch(`${API_BASE_URL}/performance/mobile-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_url: pageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to test mobile responsiveness');
    }
    
    return response.json();
  },

  // Get performance recommendations
  getRecommendations: async (token: string, pageUrl: string): Promise<Array<{
    category: 'performance' | 'accessibility' | 'seo' | 'best_practices';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
    savings?: string;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/performance/recommendations/${encodeURIComponent(pageUrl)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch performance recommendations');
    }
    
    return response.json();
  }
};
