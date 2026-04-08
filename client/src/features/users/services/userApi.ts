import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { User, CreateUserRequest, UpdateUserRequest, AssignRolesRequest } from '@/types/user';

export const userApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<User>>('/users', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },
  create: async (data: CreateUserRequest) => {
    const res = await api.post<ApiResponse<User>>('/users', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateUserRequest) => {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/users/${id}`); },
  activate: async (id: string) => {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/activate`);
    return res.data.data;
  },
  assignRoles: async (id: string, data: AssignRolesRequest) => {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/roles`, data);
    return res.data.data;
  },
};
