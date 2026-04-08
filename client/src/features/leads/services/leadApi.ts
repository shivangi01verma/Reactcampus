import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Lead, CreateLeadRequest, UpdateLeadRequest, ChangeLeadStatusRequest, AssignLeadRequest, AddLeadNoteRequest, LeadStats } from '@/types/lead';

export const leadApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Lead>>('/leads', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data;
  },
  create: async (data: CreateLeadRequest) => {
    const res = await api.post<ApiResponse<Lead>>('/leads', data);
    return res.data.data;
  },
  update: async (id: string, data: UpdateLeadRequest) => {
    const res = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => { await api.delete(`/leads/${id}`); },
  changeStatus: async (id: string, data: ChangeLeadStatusRequest) => {
    const res = await api.patch<ApiResponse<Lead>>(`/leads/${id}/status`, data);
    return res.data.data;
  },
  assign: async (id: string, data: AssignLeadRequest) => {
    const res = await api.patch<ApiResponse<Lead>>(`/leads/${id}/assign`, data);
    return res.data.data;
  },
  addNote: async (id: string, data: AddLeadNoteRequest) => {
    const res = await api.post<ApiResponse<Lead>>(`/leads/${id}/notes`, data);
    return res.data.data;
  },
  getStats: async () => {
    const res = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data.data;
  },
  export: async (params: Record<string, any> = {}) => {
    const res = await api.get('/leads/export', { params, responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  },
  bulkAction: async (data: { ids: string[]; action: string; value?: string }) => {
    const res = await api.post<ApiResponse<{ count: number }>>('/leads/bulk', data);
    return res.data.data;
  },
};
