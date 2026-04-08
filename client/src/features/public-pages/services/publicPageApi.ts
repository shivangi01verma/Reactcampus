import api from '@/lib/axios';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Page } from '@/types/page';

export interface PublicPage extends Page {
  colleges?: any[];
}

export const publicPageApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Page>>('/public/pages', { params });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<PublicPage>>(`/public/pages/${slug}`);
    return res.data.data;
  },
};
