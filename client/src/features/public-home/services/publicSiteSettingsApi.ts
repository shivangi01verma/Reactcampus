import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { SiteSettings } from '@/types/siteSettings';

export const publicSiteSettingsApi = {
  get: async () => {
    const res = await api.get<ApiResponse<SiteSettings>>('/public/site-settings');
    return res.data.data;
  },
};
