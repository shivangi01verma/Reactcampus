import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicExamApi } from '../services/publicExamApi';

export function usePublicExams(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.exams.list(params),
    queryFn: () => publicExamApi.list(params),
  });
}

export function usePublicExam(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.exams.detail(slug),
    queryFn: () => publicExamApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function usePublicExamSections(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.exams.sections(slug),
    queryFn: () => publicExamApi.getSections(slug),
    enabled: !!slug,
  });
}
