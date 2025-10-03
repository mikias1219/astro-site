const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
    options: RequestInit = {}
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

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.detail || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
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

  // Podcasts endpoints
  async getPodcasts() {
    return this.request('/podcasts/');
  }

  async getPodcast(id: number) {
    return this.request(`/podcasts/${id}`);
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

  async calculateHoroscopeMatching(data: any) {
    return this.request('/calculators/horoscope-matching', {
      method: 'POST',
      body: JSON.stringify(data),
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
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

