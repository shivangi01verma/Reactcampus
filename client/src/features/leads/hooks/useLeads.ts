import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { leadApi } from '../services/leadApi';
import { useToast } from '@/hooks/useToast';
import type { CreateLeadRequest, UpdateLeadRequest, ChangeLeadStatusRequest, AssignLeadRequest, AddLeadNoteRequest } from '@/types/lead';

export function useLeads(params: Record<string, any> = {}) {
  return useQuery({ queryKey: queryKeys.leads.list(params), queryFn: () => leadApi.list(params) });
}
export function useLead(id: string) {
  return useQuery({ queryKey: queryKeys.leads.detail(id), queryFn: () => leadApi.getById(id), enabled: !!id });
}
export function useLeadStats() {
  return useQuery({ queryKey: queryKeys.leads.stats, queryFn: () => leadApi.getStats() });
}
export function useCreateLead() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: CreateLeadRequest) => leadApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Lead created'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useUpdateLead() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateLeadRequest }) => leadApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Lead updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useDeleteLead() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (id: string) => leadApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Lead deleted'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useChangeLeadStatus() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ChangeLeadStatusRequest }) => leadApi.changeStatus(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Status updated'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useAssignLead() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: AssignLeadRequest }) => leadApi.assign(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Lead assigned'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useAddLeadNote() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: AddLeadNoteRequest }) => leadApi.addNote(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Note added'); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
}
export function useBulkLeadAction() {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: (data: { ids: string[]; action: string; value?: string }) => leadApi.bulkAction(data), onSuccess: (_data, variables) => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success(`Bulk ${variables.action} completed`); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Bulk action failed') });
}
