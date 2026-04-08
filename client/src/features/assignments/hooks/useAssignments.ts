import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { assignmentApi } from '../services/assignmentApi';
import { useToast } from '@/hooks/useToast';
import type { CreateAssignmentRequest, UpdateAssignmentRequest } from '@/types/contentAssignment';

export function useAssignments(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.contentAssignments.list(params), queryFn: () => assignmentApi.list(params) });
}
export function useAssignment(id: string) {
  return useQuery({ queryKey: queryKeys.contentAssignments.detail(id), queryFn: () => assignmentApi.getById(id), enabled: !!id });
}
export function useCreateAssignment() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateAssignmentRequest) => assignmentApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentAssignments.all }); toast.success('Assignment created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateAssignment() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) => assignmentApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentAssignments.all }); toast.success('Assignment updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteAssignment() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => assignmentApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentAssignments.all }); toast.success('Assignment deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
