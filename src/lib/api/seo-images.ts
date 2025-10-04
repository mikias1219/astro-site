// SEO Images API - Image Optimization
const API_BASE_URL = 'https://astroarupshastri.com/api/admin/seo';

export interface ImageData {
  id?: number;
  image_url: string;
  alt_text: string;
  title_attribute?: string;
  caption?: string;
  file_size: number;
  dimensions: {
    width: number;
    height: number;
  };
  compression_ratio?: number;
  is_optimized: boolean;
  page_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImageOptimizationSettings {
  quality: number; // 1-100
  max_width: number;
  max_height: number;
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  enable_lazy_loading: boolean;
  enable_compression: boolean;
}

export const seoImagesAPI = {
  // Get all images
  getAll: async (token: string): Promise<ImageData[]> => {
    const response = await fetch(`${API_BASE_URL}/images`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    
    return response.json();
  },

  // Get images by page URL
  getByPage: async (token: string, pageUrl: string): Promise<ImageData[]> => {
    const response = await fetch(`${API_BASE_URL}/images/page/${encodeURIComponent(pageUrl)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch images for page');
    }
    
    return response.json();
  },

  // Add image
  add: async (token: string, data: Omit<ImageData, 'id' | 'created_at' | 'updated_at'>): Promise<ImageData> => {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add image');
    }
    
    return response.json();
  },

  // Update image
  update: async (token: string, id: number, data: Partial<ImageData>): Promise<ImageData> => {
    const response = await fetch(`${API_BASE_URL}/images/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update image');
    }
    
    return response.json();
  },

  // Delete image
  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  },

  // Optimize image
  optimize: async (token: string, id: number, settings: ImageOptimizationSettings): Promise<{
    optimized_url: string;
    original_size: number;
    optimized_size: number;
    compression_ratio: number;
  }> => {
    const response = await fetch(`${API_BASE_URL}/images/${id}/optimize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to optimize image');
    }
    
    return response.json();
  },

  // Bulk optimize images
  bulkOptimize: async (token: string, imageIds: number[], settings: ImageOptimizationSettings): Promise<{
    success_count: number;
    failed_count: number;
    results: Array<{
      id: number;
      success: boolean;
      optimized_url?: string;
      error?: string;
    }>;
  }> => {
    const response = await fetch(`${API_BASE_URL}/images/bulk-optimize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_ids: imageIds, settings })
    });
    
    if (!response.ok) {
      throw new Error('Failed to bulk optimize images');
    }
    
    return response.json();
  },

  // Auto-generate alt text
  generateAltText: async (token: string, imageUrl: string): Promise<{alt_text: string}> => {
    const response = await fetch(`${API_BASE_URL}/images/generate-alt-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_url: imageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate alt text');
    }
    
    return response.json();
  },

  // Scan page for images
  scanPageImages: async (token: string, pageUrl: string): Promise<ImageData[]> => {
    const response = await fetch(`${API_BASE_URL}/images/scan-page`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_url: pageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to scan page images');
    }
    
    return response.json();
  },

  // Get optimization settings
  getOptimizationSettings: async (token: string): Promise<ImageOptimizationSettings> => {
    const response = await fetch(`${API_BASE_URL}/images/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch optimization settings');
    }
    
    return response.json();
  },

  // Update optimization settings
  updateOptimizationSettings: async (token: string, settings: ImageOptimizationSettings): Promise<ImageOptimizationSettings> => {
    const response = await fetch(`${API_BASE_URL}/images/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update optimization settings');
    }
    
    return response.json();
  }
};
