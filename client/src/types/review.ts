import type { ReviewStatus } from '@/config/constants';

export interface ReviewAspects {
  academics: number | null;
  faculty: number | null;
  infrastructure: number | null;
  placement: number | null;
  campus: number | null;
}

export interface Review {
  _id: string;
  id: string;
  college: string;
  user: string | null;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  content: string;
  aspects: ReviewAspects;
  status: ReviewStatus;
  moderatedBy: string | null;
  moderatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitReviewRequest {
  college: string;
  authorName?: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  content?: string;
  aspects?: Partial<ReviewAspects>;
}

export interface ModerateReviewRequest {
  status: 'approved' | 'rejected';
}
