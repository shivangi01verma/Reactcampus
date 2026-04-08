import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Exam, CreateExamRequest, UpdateExamRequest } from '@/types/exam';

export const examApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Exam>>('/exams', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Exam>>(`/exams/${id}`);
    return res.data.data;
  },
  create: async (data: CreateExamRequest) => {
    const res = await api.post<ApiResponse<Exam>>('/exams', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateExamRequest) => {
    const res = await api.patch<ApiResponse<Exam>>(`/exams/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/exams/${id}`); },
};
