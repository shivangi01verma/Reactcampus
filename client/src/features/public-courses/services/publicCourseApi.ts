import api from '@/lib/axios';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Course } from '@/types/course';
import type { College } from '@/types/college';
import type { ContentSection } from '@/types/contentSection';

export const publicCourseApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Course>>('/public/courses', { params });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Course>>(`/public/courses/${slug}`);
    return res.data.data;
  },
  getColleges: async (slug: string) => {
    const res = await api.get<ApiResponse<College[]>>(`/public/courses/${slug}/colleges`);
    return res.data.data;
  },
  getSections: async (slug: string) => {
    const res = await api.get<ApiResponse<ContentSection[]>>(`/public/courses/${slug}/sections`);
    return res.data.data;
  },
};
