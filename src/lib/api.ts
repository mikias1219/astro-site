// Dynamic API URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Production domains
    if (hostname === 'astroarupshastri.com' || hostname === 'www.astroarupshastri.com') {
      return 'https://astroarupshastri.com/api';
    }

    // Development localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
  }

  // Fallback to environment variable or localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging for API URL
if (typeof window !== 'undefined') {
  console.log('Client-side API Base URL:', API_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL env:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Window location hostname:', window.location.hostname);
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = new Headers(options.headers || {});

      // Only set Content-Type when appropriate. Do NOT set for FormData or URLSearchParams.
      const body = (options as any).body;
      const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
      const isUrlEncoded = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
      const isStringBody = typeof body === 'string';

      if (!headers.has('Content-Type') && isStringBody) {
        headers.set('Content-Type', 'application/json');
      }

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle rate limiting with retry
        if (response.status === 429 && retryCount < 3) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request(endpoint, options, retryCount + 1);
        }

        // Handle server errors with retry for GET requests
        if (response.status >= 500 && retryCount < 2 && (!options.method || options.method === 'GET')) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          return this.request(endpoint, options, retryCount + 1);
        }

        return {
          success: false,
          error: errorData.detail || errorData.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please check your connection and try again.',
        };
      }

      // Retry on network errors
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.request(endpoint, options, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    // OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);

    return this.request<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
  }

  async register(userData: {
    email: string;
    username: string;
    full_name: string;
    phone?: string;
    password: string;
    preferred_language?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registerAdmin(userData: {
    email: string;
    username: string;
    full_name: string;
    phone?: string;
    password: string;
  }) {
    return this.request('/auth/register-admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(token: string) {
    return this.request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Email verification endpoints
  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(email: string) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Password reset endpoints
  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  // Profile management endpoints
  async updateProfile(token: string, userData: any) {
    return this.request('/auth/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async changePassword(token: string, passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return this.request('/auth/me/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
  }

  // Admin endpoints
  async getDashboardStats(token: string) {
    return this.request('/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUsers(token: string, skip = 0, limit = 100) {
    return this.request(`/admin/users?skip=${skip}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUserRole(token: string, userId: number, roleUpdate: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleUpdate),
    });
  }

  // User management endpoints
  async getUserStats(token: string) {
    return this.request('/admin/users/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUser(token: string, userId: number) {
    return this.request(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUser(token: string, userId: number, userData: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(token: string, userId: number) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async verifyUser(token: string, userId: number) {
    return this.request(`/admin/users/${userId}/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async activateUser(token: string, userId: number) {
    return this.request(`/admin/users/${userId}/activate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deactivateUser(token: string, userId: number) {
    return this.request(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Services endpoints
  async getServices() {
    return this.request('/services/');
  }

  async getService(id: number) {
    return this.request(`/services/${id}`);
  }

  // Bookings endpoints
  async getBookings(token: string) {
    return this.request('/bookings/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createBooking(token: string, bookingData: any) {
    return this.request('/bookings/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  }

  async confirmBooking(token: string, bookingId: number) {
    return this.request(`/bookings/${bookingId}/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Blogs endpoints
  async getBlogs() {
    return this.request('/blogs/');
  }

  async getBlog(id: number) {
    return this.request(`/blogs/${id}`);
  }

  // Horoscopes endpoints
  async getHoroscopes() {
    return this.request('/horoscopes/');
  }

  async getHoroscope(id: number) {
    return this.request(`/horoscopes/${id}`);
  }


  // Panchang endpoints
  async getPanchang() {
    return this.request('/panchang/');
  }

  async getPanchangByDate(date: string) {
    return this.request(`/panchang/date/${date}`);
  }

  // Testimonials endpoints
  async getTestimonials() {
    return this.request('/testimonials/');
  }

  async createTestimonial(testimonialData: any) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  // FAQs endpoints
  async getFAQs() {
    return this.request('/faqs/');
  }

  // Calculators endpoints
  async calculateKundli(data: any) {
    return this.request('/calculators/kundli', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateDosha(data: any) {
    return this.request('/calculators/dosha', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateGemstone(data: any) {
    return this.request('/calculators/gemstone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateHoroscopeMatching(maleData: any, femaleData: any) {
    return this.request('/calculators/horoscope-matching', {
      method: 'POST',
      body: JSON.stringify({ male_details: maleData, female_details: femaleData }),
    });
  }

  async calculateAscendant(data: any) {
    return this.request('/calculators/ascendant', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateMoonSign(data: any) {
    return this.request('/calculators/moon-sign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateRudraksha(data: any) {
    return this.request('/calculators/rudraksha', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateNumerology(data: any) {
    return this.request('/numerology/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDashboard() {
    return this.request('/admin/dashboard');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

