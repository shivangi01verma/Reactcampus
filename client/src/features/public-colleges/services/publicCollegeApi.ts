import api from '@/lib/axios';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { College } from '@/types/college';
import type { Review } from '@/types/review';
import type { ContentSection } from '@/types/contentSection';

export const publicCollegeApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<College>>('/public/colleges', { params });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<College>>(`/public/colleges/${slug}`);
    return res.data.data;
  },
  getReviews: async (slug: string, params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Review>>(`/public/colleges/${slug}/reviews`, { params });
    return res.data;
  },
  getSections: async (slug: string) => {
    const res = await api.get<ApiResponse<ContentSection[]>>(`/public/colleges/${slug}/sections`);
    return res.data.data;
  },
};
