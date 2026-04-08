import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { examApi } from '../services/examApi';
import { useToast } from '@/hooks/useToast';
import type { CreateExamRequest, UpdateExamRequest } from '@/types/exam';

export function useExams(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.exams.list(params), queryFn: () => examApi.list(params) });
}
export function useExam(id: string) {
  return useQuery({ queryKey: queryKeys.exams.detail(id), queryFn: () => examApi.getById(id), enabled: !!id });
}
export function useCreateExam() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateExamRequest) => examApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.exams.all }); toast.success('Exam created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateExam() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateExamRequest }) => examApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.exams.all }); toast.success('Exam updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteExam() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => examApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.exams.all }); toast.success('Exam deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
