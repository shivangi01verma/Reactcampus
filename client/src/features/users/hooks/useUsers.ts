import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { userApi } from '../services/userApi';
import { useToast } from '@/hooks/useToast';
import type { CreateUserRequest, UpdateUserRequest, AssignRolesRequest } from '@/types/user';

export function useUsers(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.users.list(params), queryFn: () => userApi.list(params) });
}
export function useUser(id: string) {
  return useQuery({ queryKey: queryKeys.users.detail(id), queryFn: () => userApi.getById(id), enabled: !!id });
}
export function useCreateUser() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateUserRequest) => userApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateUser() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => userApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteUser() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => userApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useActivateUser() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => userApi.activate(id), onSuccess: (user) => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success(user?.isActive ? 'User activated' : 'User deactivated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useAssignRoles() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: AssignRolesRequest }) => userApi.assignRoles(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('Roles assigned'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
