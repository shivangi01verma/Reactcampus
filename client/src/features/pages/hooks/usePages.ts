import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { pageApi } from '../services/pageApi';
import { useToast } from '@/hooks/useToast';
import type { CreatePageRequest, UpdatePageRequest, PublishPageRequest } from '@/types/page';

export function usePages(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.pages.list(params), queryFn: () => pageApi.list(params) });
}
export function usePage(id: string) {
  return useQuery({ queryKey: queryKeys.pages.detail(id), queryFn: () => pageApi.getById(id), enabled: !!id });
}
export function useCreatePage() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreatePageRequest) => pageApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.pages.all }); toast.success('Page created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdatePage() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdatePageRequest }) => pageApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.pages.all }); toast.success('Page updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeletePage() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => pageApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.pages.all }); toast.success('Page deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function usePublishPage() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: PublishPageRequest }) => pageApi.publish(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.pages.all }); toast.success('Status updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
