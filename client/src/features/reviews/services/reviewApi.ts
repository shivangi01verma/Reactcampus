import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Review, ModerateReviewRequest } from '@/types/review';

export const reviewApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Review>>('/reviews', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Review>>(`/reviews/${id}`);
    return res.data.data;
  },
  moderate: async (id: string, data: ModerateReviewRequest) => {
    const res = await api.patch<ApiResponse<Review>>(`/reviews/${id}/moderate`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/reviews/${id}`); },
};
