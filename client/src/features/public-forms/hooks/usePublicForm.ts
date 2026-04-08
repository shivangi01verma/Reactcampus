import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicFormApi } from '../services/publicFormApi';

export function usePublicForm(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.forms.detail(slug),
    queryFn: () => publicFormApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useSubmitForm(slug: string) {
  return useMutation({
    mutationFn: (payload: { data: Record<string, any>; pageContext?: Record<string, any> }) =>
      publicFormApi.submit(slug, payload),
  });
}

export function usePageForms(pageType: string, entityId?: string) {
  return useQuery({
    queryKey: queryKeys.public.forms.forPage(pageType, entityId),
    queryFn: () => publicFormApi.getForPage(pageType, entityId),
    enabled: !!pageType,
    staleTime: 5 * 60 * 1000,
  });
}
