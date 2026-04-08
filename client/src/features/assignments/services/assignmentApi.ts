import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { ContentAssignment, CreateAssignmentRequest, UpdateAssignmentRequest } from '@/types/contentAssignment';

export const assignmentApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<ContentAssignment>>('/content-assignments', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<ContentAssignment>>(`/content-assignments/${id}`);
    return res.data.data;
  },
  create: async (data: CreateAssignmentRequest) => {
    const res = await api.post<ApiResponse<ContentAssignment>>('/content-assignments', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateAssignmentRequest) => {
    const res = await api.patch<ApiResponse<ContentAssignment>>(`/content-assignments/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/content-assignments/${id}`); },
};
