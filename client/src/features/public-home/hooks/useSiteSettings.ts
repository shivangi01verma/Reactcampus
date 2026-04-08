import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicSiteSettingsApi } from '../services/publicSiteSettingsApi';

export function usePublicSiteSettings() {
  return useQuery({
    queryKey: queryKeys.public.siteSettings.detail,
    queryFn: () => publicSiteSettingsApi.get(),
    staleTime: 5 * 60 * 1000,
  });
}
