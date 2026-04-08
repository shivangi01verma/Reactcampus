import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { collegeApi } from '../services/collegeApi';
import { useToast } from '@/hooks/useToast';
import type { CreateCollegeRequest, UpdateCollegeRequest, PublishCollegeRequest, ManageCoursesRequest, ManageExamsRequest } from '@/types/college';

export function useColleges(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.colleges.list(params), queryFn: () => collegeApi.list(params) });
}
export function useCollege(id: string) {
  return useQuery({ queryKey: queryKeys.colleges.detail(id), queryFn: () => collegeApi.getById(id), enabled: !!id });
}
export function useCreateCollege() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateCollegeRequest) => collegeApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('College created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateCollege() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateCollegeRequest }) => collegeApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('College updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteCollege() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => collegeApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('College deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function usePublishCollege() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: PublishCollegeRequest }) => collegeApi.publish(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('Status updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useManageCollegeCourses() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ManageCoursesRequest }) => collegeApi.manageCourses(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('Courses updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useManageCollegeExams() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ManageExamsRequest }) => collegeApi.manageExams(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.colleges.all }); toast.success('Exams updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
