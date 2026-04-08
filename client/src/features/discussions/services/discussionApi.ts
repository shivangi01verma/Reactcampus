import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Discussion, ModerateDiscussionRequest } from '@/types/discussion';

export const discussionApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Discussion>>('/discussions', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Discussion>>(`/discussions/${id}`);
    return res.data.data;
  },
  moderate: async (id: string, data: ModerateDiscussionRequest) => {
    const res = await api.patch<ApiResponse<Discussion>>(`/discussions/${id}/moderate`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/discussions/${id}`); },
};
