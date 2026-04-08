import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { PublicInsights } from '@/types/analytics';

export function usePublicInsights() {
  return useQuery({
    queryKey: queryKeys.public.insights,
    queryFn: async () => {
      const res = await api.get<ApiResponse<PublicInsights>>('/public/college-insights');
      return res.data.data;
    },
  });
}
