import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

export const categoryApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data.data;
  },
  create: async (data: CreateCategoryRequest) => {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateCategoryRequest) => {
    const res = await api.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};

export const publicCategoryApi = {
  list: async () => {
    const res = await api.get<ApiResponse<Category[]>>('/public/categories');
    return res.data.data;
  },
};
