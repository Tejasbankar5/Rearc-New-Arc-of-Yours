import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useArcStore = create((set, get) => ({
  arc: null,
  loading: false,
  error: null,
  verifyResult: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/arcs/dashboard');
      set({ arc: res.data.arc, loading: false });
      if (res.data.user) {
        useAuthStore.setState({ user: res.data.user });
      }
    } catch (error) {
      set({ error: 'Failed to load dashboard data', loading: false });
    }
  },

  generateArc: async (formData) => {
    set({ loading: true, error: null });
    try {
      await api.post('/arcs/generate', formData);
      await get().fetchDashboard();
      set({ loading: false });
    } catch (error) {
      const msg = error.response?.data?.error || 'Generation failed';
      set({ error: msg, loading: false });
      throw error;
    }
  },

  verifyTask: async (taskId, answer) => {
    set({ loading: true, error: null, verifyResult: null });
    try {
      const res = await api.post('/arcs/verify-task', { taskId, answer });
      set({ verifyResult: res.data, loading: false });
      // Optimistically mark task completed in local state
      set((state) => ({
        arc: state.arc ? {
          ...state.arc,
          tasks: state.arc.tasks.map(t =>
            t.id === taskId
              ? { ...t, completed: true, aiVerified: true, confidenceScore: res.data.result?.score }
              : t
          )
        } : state.arc
      }));
      // Sync user XP from server
      const dashRes = await api.get('/arcs/dashboard');
      if (dashRes.data.user) {
        useAuthStore.setState({ user: dashRes.data.user });
      }
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Mark task complete WITHOUT AI verification (simple toggle)
  toggleTask: async (taskId) => {
    const currentArc = get().arc;
    if (!currentArc) return;
    const task = currentArc.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    set((state) => ({
      arc: {
        ...state.arc,
        tasks: state.arc.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      }
    }));

    try {
      await api.patch(`/arcs/tasks/${taskId}/toggle`);
      // Sync XP
      const dashRes = await api.get('/arcs/dashboard');
      if (dashRes.data.user) {
        useAuthStore.setState({ user: dashRes.data.user });
      }
    } catch (error) {
      // Rollback on failure
      set((state) => ({
        arc: {
          ...state.arc,
          tasks: state.arc.tasks.map(t =>
            t.id === taskId ? { ...t, completed: task.completed } : t
          )
        }
      }));
    }
  },

  sendChatMessage: async (message, context) => {
    try {
      const res = await api.post('/arcs/chat', { message, context });
      return res.data.reply;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send message');
    }
  },

  setupConfig: null,
  fetchSetupConfig: async () => {
    try {
      const res = await api.get('/arcs/setup-config');
      set({ setupConfig: res.data });
    } catch (error) {
      console.error('Failed to fetch setup config', error);
      // Fallback config in case of failure
      set({ setupConfig: {
        presets: ['DSA + LeetCode', 'MLOps Engineer', 'Full Stack Dev', 'System Design', 'Data Science'],
        placeholders: {
          targetField: 'e.g. MLOps, Full Stack...',
          goals: 'e.g. Build 2 production projects...',
          weakAreas: 'e.g. Recursion, System Design'
        },
        labels: {
          title: 'Configure Your',
          subtitle: 'The AI will generate a psychologically optimized 30-day roadmap tailored to your exact parameters.'
        }
      } });
    }
  },

  clearVerifyResult: () => set({ verifyResult: null }),
  clearError: () => set({ error: null }),
}));
