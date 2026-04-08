import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { courseApi } from '../services/courseApi';
import { useToast } from '@/hooks/useToast';
import type { CreateCourseRequest, UpdateCourseRequest } from '@/types/course';

export function useCourses(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.courses.list(params), queryFn: () => courseApi.list(params) });
}
export function useCourse(id: string) {
  return useQuery({ queryKey: queryKeys.courses.detail(id), queryFn: () => courseApi.getById(id), enabled: !!id });
}
export function useCreateCourse() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateCourseRequest) => courseApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.courses.all }); toast.success('Course created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateCourse() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) => courseApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.courses.all }); toast.success('Course updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteCourse() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => courseApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.courses.all }); toast.success('Course deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useCourseColleges(courseId: string) {
  return useQuery({ queryKey: [...queryKeys.courses.detail(courseId), 'colleges'] as const, queryFn: () => courseApi.getColleges(courseId), enabled: !!courseId });
}
