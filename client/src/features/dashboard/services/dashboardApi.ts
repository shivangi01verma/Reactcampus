import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DashboardStats, PipelineData, ActivityItem } from '@/types/dashboard';
import type { FullAnalytics } from '@/types/analytics';

export const dashboardApi = {
  getStats: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data.data;
  },

  getPipeline: async () => {
    const res = await api.get<ApiResponse<PipelineData[]>>('/dashboard/pipeline');
    return res.data.data;
  },

  getActivity: async () => {
    const res = await api.get<ApiResponse<ActivityItem[]>>('/dashboard/activity');
    return res.data.data;
  },

  getAnalytics: async () => {
    const res = await api.get<ApiResponse<FullAnalytics>>('/dashboard/analytics');
    return res.data.data;
  },
};
