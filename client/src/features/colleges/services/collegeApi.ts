import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { College, CreateCollegeRequest, UpdateCollegeRequest, PublishCollegeRequest, ManageCoursesRequest, ManageExamsRequest } from '@/types/college';

export const collegeApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<College>>('/colleges', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<College>>(`/colleges/${id}`);
    return res.data.data;
  },
  create: async (data: CreateCollegeRequest) => {
    const res = await api.post<ApiResponse<College>>('/colleges', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateCollegeRequest) => {
    const res = await api.patch<ApiResponse<College>>(`/colleges/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/colleges/${id}`); },
  publish: async (id: string, data: PublishCollegeRequest) => {
    const res = await api.patch<ApiResponse<College>>(`/colleges/${id}/publish`, data);
    return res.data.data;
  },
  manageCourses: async (id: string, data: ManageCoursesRequest) => {
    const res = await api.patch<ApiResponse<College>>(`/colleges/${id}/courses`, data);
    return res.data.data;
  },
  manageExams: async (id: string, data: ManageExamsRequest) => {
    const res = await api.patch<ApiResponse<College>>(`/colleges/${id}/exams`, data);
    return res.data.data;
  },
};
