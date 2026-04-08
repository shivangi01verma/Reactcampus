import { useAuthStore } from '@/stores/authStore';

export function usePermissions() {
  const { hasPermission, hasAnyPermission, permissions } = useAuthStore();
  return { hasPermission, hasAnyPermission, permissions };
}
