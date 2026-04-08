import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Page, CreatePageRequest, UpdatePageRequest, PublishPageRequest } from '@/types/page';

export const pageApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Page>>('/pages', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Page>>(`/pages/${id}`);
    return res.data.data;
  },
  create: async (data: CreatePageRequest) => {
    const res = await api.post<ApiResponse<Page>>('/pages', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdatePageRequest) => {
    const res = await api.patch<ApiResponse<Page>>(`/pages/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/pages/${id}`); },
  publish: async (id: string, data: PublishPageRequest) => {
    const res = await api.patch<ApiResponse<Page>>(`/pages/${id}/publish`, data);
    return res.data.data;
  },
};
