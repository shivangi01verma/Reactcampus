import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicPageApi } from '../services/publicPageApi';

export function usePublicPages(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.pages.list(params),
    queryFn: () => publicPageApi.list(params),
  });
}

export function usePublicPage(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.pages.detail(slug),
    queryFn: () => publicPageApi.getBySlug(slug),
    enabled: !!slug,
  });
}
