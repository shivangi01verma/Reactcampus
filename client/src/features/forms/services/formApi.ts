import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { DynamicForm, CreateFormRequest, UpdateFormRequest } from '@/types/form';

export const formApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<DynamicForm>>('/forms', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<DynamicForm>>(`/forms/${id}`);
    return res.data.data;
  },
  create: async (data: CreateFormRequest) => {
    const res = await api.post<ApiResponse<DynamicForm>>('/forms', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateFormRequest) => {
    const res = await api.patch<ApiResponse<DynamicForm>>(`/forms/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/forms/${id}`); },
  publish: async (id: string, isPublished: boolean) => {
    const res = await api.patch<ApiResponse<DynamicForm>>(`/forms/${id}/publish`, { isPublished });
    return res.data.data;
  },
  assignPages: async (id: string, assignedPages: any[]) => {
    const res = await api.patch<ApiResponse<DynamicForm>>(`/forms/${id}/pages`, { assignedPages });
    return res.data.data;
  },
};
