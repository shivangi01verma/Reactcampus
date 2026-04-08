import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Role, Permission, CreateRoleRequest, UpdateRoleRequest, AssignPermissionsRequest } from '@/types/role';

export const roleApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Role>>('/roles', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Role>>(`/roles/${id}`);
    return res.data.data;
  },
  create: async (data: CreateRoleRequest) => {
    const res = await api.post<ApiResponse<Role>>('/roles', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateRoleRequest) => {
    const res = await api.patch<ApiResponse<Role>>(`/roles/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/roles/${id}`); },
  assignPermissions: async (id: string, data: AssignPermissionsRequest) => {
    const res = await api.patch<ApiResponse<Role>>(`/roles/${id}/permissions`, data);
    return res.data.data;
  },
  getPermissions: async () => {
    const res = await api.get<ApiResponse<Permission[]>>('/permissions');
    return res.data.data;
  },
};
