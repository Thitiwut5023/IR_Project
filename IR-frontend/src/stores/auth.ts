import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'

interface UserState {
  token: string;
  userId: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): UserState => {
    const token = localStorage.getItem('token') || '';
    let userId = null;

    // Try to decode the stored token when initializing state
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload & { user_id: number }>(token);
        userId = decoded.user_id;
      } catch (error) {
        console.error('Error decoding stored token:', error);
        // Invalid token in storage, clear it
        localStorage.removeItem('token');
      }
    }

    return {
      token,
      userId
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      
      try {
        // Decode JWT token to get user info
        const decoded = jwtDecode<JwtPayload & { user_id: number }>(token);
        this.userId = decoded.user_id;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout(); // If token is invalid, logout
      }
    },
    logout() {
      this.token = '';
      this.userId = null;
      localStorage.removeItem('token');
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
