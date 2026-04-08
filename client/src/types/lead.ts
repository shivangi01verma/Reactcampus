import type { LeadPriority, LeadStatus } from '@/config/constants';

export interface LeadStatusHistoryEntry {
  from: string;
  to: string;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface LeadNote {
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  data: Record<string, unknown>;
  source: {
    form: string | null;
    submission: string | null;
    channel: string;
  };
  college: string | null;
  course: string | null;
  status: LeadStatus;
  statusHistory: LeadStatusHistoryEntry[];
  assignedTo: string | null;
  priority: LeadPriority;
  tags: string[];
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  college?: string;
  course?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  tags?: string[];
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {}

export interface ChangeLeadStatusRequest {
  status: LeadStatus;
  note?: string;
}

export interface AssignLeadRequest {
  assignedTo: string;
}

export interface AddLeadNoteRequest {
  content: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  todayCount: number;
  thisWeekCount: number;
}
