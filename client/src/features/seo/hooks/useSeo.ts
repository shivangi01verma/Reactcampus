import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { seoApi } from '../services/seoApi';
import { useToast } from '@/hooks/useToast';
import type { CreateSeoRequest, UpdateSeoRequest } from '@/types/seo';

export function useSeoEntries(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.seo.list(params), queryFn: () => seoApi.list(params) });
}
export function useSeo(id: string) {
  return useQuery({ queryKey: queryKeys.seo.detail(id), queryFn: () => seoApi.getById(id), enabled: !!id });
}
export function useCreateSeo() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateSeoRequest) => seoApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.seo.all }); toast.success('SEO created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateSeo() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateSeoRequest }) => seoApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.seo.all }); toast.success('SEO updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteSeo() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => seoApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.seo.all }); toast.success('SEO deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
