import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, permissions, isAuthenticated, isLoading, hasPermission, hasAnyPermission, logout } =
    useAuthStore();

  return {
    user,
    permissions,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    logout,
  };
}
