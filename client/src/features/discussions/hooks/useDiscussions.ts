import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { discussionApi } from '../services/discussionApi';
import { useToast } from '@/hooks/useToast';
import type { ModerateDiscussionRequest } from '@/types/discussion';

export function useDiscussions(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.discussions.list(params), queryFn: () => discussionApi.list(params) });
}
export function useDiscussion(id: string) {
  return useQuery({ queryKey: queryKeys.discussions.detail(id), queryFn: () => discussionApi.getById(id), enabled: !!id });
}
export function useModerateDiscussion() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ModerateDiscussionRequest }) => discussionApi.moderate(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.discussions.all }); toast.success('Discussion moderated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteDiscussion() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => discussionApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.discussions.all }); toast.success('Discussion deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
