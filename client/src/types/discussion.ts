import type { DiscussionStatus } from '@/config/constants';

export interface Discussion {
  _id: string;
  id: string;
  college: { _id: string; name: string; slug: string } | string | null;
  course: { _id: string; name: string; slug: string } | string | null;
  exam: { _id: string; name: string; slug: string } | string | null;
  user: string | null;
  authorName: string;
  authorEmail: string;
  content: string;
  status: DiscussionStatus;
  moderatedBy: string | null;
  moderatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitDiscussionRequest {
  college?: string;
  course?: string;
  exam?: string;
  content: string;
  authorName?: string;
  authorEmail?: string;
}

export interface ModerateDiscussionRequest {
  status: 'approved' | 'rejected';
}
