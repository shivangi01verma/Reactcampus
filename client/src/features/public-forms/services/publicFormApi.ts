import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DynamicForm, FormSubmission } from '@/types/form';

export const publicFormApi = {
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<DynamicForm>>(`/public/forms/${slug}`);
    return res.data.data;
  },
  submit: async (slug: string, payload: { data: Record<string, any>; pageContext?: Record<string, any> }) => {
    const res = await api.post<ApiResponse<FormSubmission>>(`/public/forms/${slug}/submit`, payload);
    return res.data.data;
  },
  getForPage: async (pageType: string, entityId?: string) => {
    const params: Record<string, string> = { pageType };
    if (entityId) params.entityId = entityId;
    const res = await api.get<ApiResponse<any[]>>('/public/forms/for-page', { params });
    return res.data.data;
  },
};
