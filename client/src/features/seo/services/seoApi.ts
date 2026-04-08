import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { SEO, CreateSeoRequest, UpdateSeoRequest } from '@/types/seo';

export const seoApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<SEO>>('/seo', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<SEO>>(`/seo/${id}`);
    return res.data.data;
  },
  create: async (data: CreateSeoRequest) => {
    const res = await api.post<ApiResponse<SEO>>('/seo', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateSeoRequest) => {
    const res = await api.patch<ApiResponse<SEO>>(`/seo/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/seo/${id}`); },
};
