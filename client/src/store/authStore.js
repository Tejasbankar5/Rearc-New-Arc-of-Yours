import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Login failed', loading: false });
          throw error;
        }
      },

      signup: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Signup failed', loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
    }
  )
);
