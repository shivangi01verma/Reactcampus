import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, permissions: string[]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, permissions) =>
    set({ user, permissions, isAuthenticated: true, isLoading: false }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, permissions: [], isAuthenticated: false, isLoading: false });
  },

  hasPermission: (permission) => get().permissions.includes(permission),

  hasAnyPermission: (...permissions) =>
    permissions.some((p) => get().permissions.includes(p)),
}));
