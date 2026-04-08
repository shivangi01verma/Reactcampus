import type { ContentType } from '@/config/constants';

export interface ContentSection {
  _id: string;
  id: string;
  college?: string;
  exam?: string;
  course?: string;
  sectionKey: string;
  title: string;
  content: unknown;
  contentType: ContentType;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentSectionRequest {
  college?: string;
  exam?: string;
  course?: string;
  sectionKey: string;
  title: string;
  content?: unknown;
  contentType: ContentType;
  order?: number;
  isVisible?: boolean;
}

export interface UpdateContentSectionRequest {
  title?: string;
  content?: unknown;
  contentType?: ContentType;
  order?: number;
  isVisible?: boolean;
}
