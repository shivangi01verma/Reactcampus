import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '@/types/course';

export const courseApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Course>>('/courses', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return res.data.data;
  },
  create: async (data: CreateCourseRequest) => {
    const res = await api.post<ApiResponse<Course>>('/courses', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateCourseRequest) => {
    const res = await api.patch<ApiResponse<Course>>(`/courses/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/courses/${id}`); },
  getColleges: async (courseId: string) => {
    const res = await api.get<ApiResponse<any[]>>(`/courses/${courseId}/colleges`);
    return res.data.data;
  },
};
