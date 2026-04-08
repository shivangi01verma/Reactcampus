import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicCourseApi } from '../services/publicCourseApi';

export function usePublicCourses(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.courses.list(params),
    queryFn: () => publicCourseApi.list(params),
  });
}

export function usePublicCourse(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.courses.detail(slug),
    queryFn: () => publicCourseApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function usePublicCourseColleges(slug: string) {
  return useQuery({
    queryKey: [...queryKeys.public.courses.detail(slug), 'colleges'] as const,
    queryFn: () => publicCourseApi.getColleges(slug),
    enabled: !!slug,
  });
}

export function usePublicCourseSections(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.courses.sections(slug),
    queryFn: () => publicCourseApi.getSections(slug),
    enabled: !!slug,
  });
}
