import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicCollegeApi } from '../services/publicCollegeApi';

export function usePublicColleges(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.colleges.list(params),
    queryFn: () => publicCollegeApi.list(params),
  });
}

export function usePublicCollege(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.colleges.detail(slug),
    queryFn: () => publicCollegeApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function usePublicCollegeReviews(slug: string, params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.colleges.reviews(slug, params),
    queryFn: () => publicCollegeApi.getReviews(slug, params),
    enabled: !!slug,
  });
}

export function usePublicCollegeSections(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.colleges.sections(slug),
    queryFn: () => publicCollegeApi.getSections(slug),
    enabled: !!slug,
  });
}
