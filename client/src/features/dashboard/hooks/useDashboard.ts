import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { dashboardApi } from '../services/dashboardApi';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
  });
}

export function useDashboardPipeline() {
  return useQuery({
    queryKey: queryKeys.dashboard.pipeline,
    queryFn: dashboardApi.getPipeline,
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: queryKeys.dashboard.activity,
    queryFn: dashboardApi.getActivity,
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics,
    queryFn: dashboardApi.getAnalytics,
  });
}
