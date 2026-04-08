import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { ContentSection, CreateContentSectionRequest, UpdateContentSectionRequest } from '@/types/contentSection';

export const contentSectionApi = {
  getByCollege: async (collegeId: string) => {
    const res = await api.get<ApiResponse<ContentSection[]>>('/content-sections', { params: { college: collegeId } });
    return res.data.data;
  },
  getByExam: async (examId: string) => {
    const res = await api.get<ApiResponse<ContentSection[]>>('/content-sections', { params: { exam: examId } });
    return res.data.data;
  },
  getByCourse: async (courseId: string) => {
    const res = await api.get<ApiResponse<ContentSection[]>>('/content-sections', { params: { course: courseId } });
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<ContentSection>>(`/content-sections/${id}`);
    return res.data.data;
  },
  create: async (data: CreateContentSectionRequest) => {
    const res = await api.post<ApiResponse<ContentSection>>('/content-sections', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateContentSectionRequest) => {
    const res = await api.patch<ApiResponse<ContentSection>>(`/content-sections/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/content-sections/${id}`); },
};
