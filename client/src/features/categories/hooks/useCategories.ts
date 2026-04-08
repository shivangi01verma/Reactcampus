import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { categoryApi, publicCategoryApi } from '../services/categoryApi';
import { useToast } from '@/hooks/useToast';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

export function useCategories(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.categories.list(params), queryFn: () => categoryApi.list(params) });
}

export function useCategory(id: string) {
  return useQuery({ queryKey: queryKeys.categories.detail(id), queryFn: () => categoryApi.getById(id), enabled: !!id });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category created'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) => categoryApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category updated'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: queryKeys.public.categories.list,
    queryFn: () => publicCategoryApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}
