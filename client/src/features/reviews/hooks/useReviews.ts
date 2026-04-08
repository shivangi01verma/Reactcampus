import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { reviewApi } from '../services/reviewApi';
import { useToast } from '@/hooks/useToast';
import type { ModerateReviewRequest } from '@/types/review';

export function useReviews(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.reviews.list(params), queryFn: () => reviewApi.list(params) });
}
export function useReview(id: string) {
  return useQuery({ queryKey: queryKeys.reviews.detail(id), queryFn: () => reviewApi.getById(id), enabled: !!id });
}
export function useModerateReview() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ModerateReviewRequest }) => reviewApi.moderate(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.reviews.all }); toast.success('Review moderated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteReview() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => reviewApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.reviews.all }); toast.success('Review deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
