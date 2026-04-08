import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { SiteSettings, UpdateSiteSettingsRequest } from '@/types/siteSettings';

export const siteSettingsApi = {
  get: async () => {
    const res = await api.get<ApiResponse<SiteSettings>>('/site-settings');
    return res.data.data;
  },
  update: async (data: UpdateSiteSettingsRequest) => {
    const res = await api.patch<ApiResponse<SiteSettings>>('/site-settings', data);
    return res.data.data;
  },
};
