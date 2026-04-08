import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { FormSubmission } from '@/types/form';

export const submissionApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<FormSubmission>>('/submissions', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<FormSubmission>>(`/submissions/${id}`);
    return res.data.data;
  },
};
