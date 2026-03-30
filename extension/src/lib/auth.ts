import api from './api';

class AuthService {
  private user: any = null;
  private token: string | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const result = await chrome.storage.local.get(['authToken', 'user']);
    this.token = result.authToken || null;
    this.user = result.user || null;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await api.getCurrentUser();
      if (response.data) {
        this.user = response.data;
        await chrome.storage.local.set({ user: response.data });
      }
      return true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Don't log out user on API failure to avoid constant login prompts
      return false;
    }
  }

  async login(email: string): Promise<boolean> {
    try {
      const response = await api.createMagicLink(email);
      if (response.success) {
        // In a real implementation, we would show a message to check email
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async verifyMagicLink(token: string): Promise<boolean> {
    try {
      const response = await api.verifyMagicLink(token);
      if (response.success) {
        this.token = response.access_token;
        this.user = response.user;
        await chrome.storage.local.set({
          authToken: response.access_token,
          user: response.user,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Magic link verification failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    this.user = null;
    await chrome.storage.local.remove(['authToken', 'user']);
  }

  getUser(): any {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  async getBillingStatus(): Promise<any> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await api.getBillingStatus();
      return response.data;
    } catch (error) {
      console.error('Failed to get billing status:', error);
      return null;
    }
  }
}

export default new AuthService();