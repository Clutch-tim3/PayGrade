const API_BASE_URL = 'https://api.paygrade.so/v1';

class APIService {
  private async getAuthToken(): Promise<string | null> {
    const result = await chrome.storage.local.get(['authToken']);
    return result.authToken || null;
  }

  private async request(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAuthToken();
    
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'API Error',
        message: `HTTP ${response.status} ${response.statusText}`,
      }));
      throw error;
    }

    return response;
  }

  async lookupSalary(params: any): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/salary/lookup`, {
      method: 'POST',
      body: JSON.stringify(params),
    });

    return response.json();
  }

  async submitSalary(data: any): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/salary/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async createMagicLink(email: string): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/auth/magic-link`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.json();
  }

  async verifyMagicLink(token: string): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    
    if (result.access_token) {
      await chrome.storage.local.set({
        authToken: result.access_token,
        user: result.user,
      });
    }

    return result;
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/user/me`);
    const result = await response.json();
    
    if (result.data) {
      await chrome.storage.local.set({ user: result.data });
    }

    return result;
  }

  async getBillingStatus(): Promise<any> {
    const response = await this.request(`${API_BASE_URL}/billing/status`);
    return response.json();
  }

  async clearAuthToken(): Promise<void> {
    await chrome.storage.local.remove(['authToken', 'user']);
  }

  async generatePDF(salaryData: any): Promise<Blob> {
    const response = await this.request(`${API_BASE_URL}/salary/generate-pdf`, {
      method: 'POST',
      body: JSON.stringify(salaryData),
    });

    return response.blob();
  }
}

export default new APIService();