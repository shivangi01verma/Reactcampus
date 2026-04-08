import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { formApi } from '../services/formApi';
import { submissionApi } from '../services/submissionApi';
import { useToast } from '@/hooks/useToast';
import type { CreateFormRequest, UpdateFormRequest } from '@/types/form';

export function useForms(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.forms.list(params), queryFn: () => formApi.list(params) });
}
export function useForm(id: string) {
  return useQuery({ queryKey: queryKeys.forms.detail(id), queryFn: () => formApi.getById(id), enabled: !!id });
}
export function useCreateForm() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateFormRequest) => formApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.forms.all }); toast.success('Form created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateForm() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateFormRequest }) => formApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.forms.all }); toast.success('Form updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteForm() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => formApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.forms.all }); toast.success('Form deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function usePublishForm() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => formApi.publish(id, isPublished), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.forms.all }); toast.success('Form status updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useSubmissions(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.submissions.list(params), queryFn: () => submissionApi.list(params) });
}
export function useSubmission(id: string) {
  return useQuery({ queryKey: queryKeys.submissions.detail(id), queryFn: () => submissionApi.getById(id), enabled: !!id });
}
