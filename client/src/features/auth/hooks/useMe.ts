import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { queryKeys } from '@/config/queryKeys';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authApi.me(),
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
  });
}
