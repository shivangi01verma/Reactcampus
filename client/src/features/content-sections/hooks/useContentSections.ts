import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { contentSectionApi } from '../services/contentSectionApi';
import { useToast } from '@/hooks/useToast';
import type { CreateContentSectionRequest, UpdateContentSectionRequest } from '@/types/contentSection';

export function useContentSections(collegeId: string) {
  return useQuery({ queryKey: queryKeys.contentSections.byCollege(collegeId), queryFn: () => contentSectionApi.getByCollege(collegeId), enabled: !!collegeId });
}
export function useExamContentSections(examId: string) {
  return useQuery({ queryKey: queryKeys.contentSections.byExam(examId), queryFn: () => contentSectionApi.getByExam(examId), enabled: !!examId });
}
export function useCourseContentSections(courseId: string) {
  return useQuery({ queryKey: queryKeys.contentSections.byCourse(courseId), queryFn: () => contentSectionApi.getByCourse(courseId), enabled: !!courseId });
}
export function useContentSection(id: string) {
  return useQuery({ queryKey: queryKeys.contentSections.detail(id), queryFn: () => contentSectionApi.getById(id), enabled: !!id });
}
export function useCreateContentSection() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateContentSectionRequest) => contentSectionApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentSections.all }); toast.success('Section created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateContentSection() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateContentSectionRequest }) => contentSectionApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentSections.all }); toast.success('Section updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteContentSection() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => contentSectionApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.contentSections.all }); toast.success('Section deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
