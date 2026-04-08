import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { siteSettingsApi } from '../services/siteSettingsApi';
import type { UpdateSiteSettingsRequest } from '@/types/siteSettings';

export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.siteSettings.detail,
    queryFn: () => siteSettingsApi.get(),
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSiteSettingsRequest) => siteSettingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings.detail });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.siteSettings.detail });
    },
  });
}
