import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { roleApi } from '../services/roleApi';
import { useToast } from '@/hooks/useToast';
import type { CreateRoleRequest, UpdateRoleRequest, AssignPermissionsRequest } from '@/types/role';

export function useRoles(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.roles.list(params), queryFn: () => roleApi.list(params) });
}
export function useRole(id: string) {
  return useQuery({ queryKey: queryKeys.roles.detail(id), queryFn: () => roleApi.getById(id), enabled: !!id });
}
export function usePermissions() {
  return useQuery({ queryKey: queryKeys.permissions.all, queryFn: () => roleApi.getPermissions() });
}
export function useCreateRole() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateRoleRequest) => roleApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.roles.all }); toast.success('Role created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateRole() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => roleApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.roles.all }); toast.success('Role updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteRole() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => roleApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.roles.all }); toast.success('Role deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useAssignPermissions() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: AssignPermissionsRequest }) => roleApi.assignPermissions(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.roles.all }); toast.success('Permissions updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
