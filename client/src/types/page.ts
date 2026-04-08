import type { PageStatus } from '@/config/constants';

export interface PageContentBlock {
  title: string;
  contentType: 'richtext' | 'table' | 'faq' | 'list';
  content: unknown;
  order: number;
}

export interface PageCollegeFilter {
  enabled: boolean;
  filterBy: 'course' | 'exam' | 'type' | 'state' | 'city' | 'all';
  courses: string[];
  exams: string[];
  collegeType: string;
  state: string;
  city: string;
}

export interface PageSidebarLink {
  label: string;
  url: string;
}

export interface PageSidebarGroup {
  title: string;
  links: PageSidebarLink[];
}

export interface Page {
  _id: string;
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  description: string;
  contentBlocks: PageContentBlock[];
  collegeFilter: PageCollegeFilter;
  sidebarLinks: PageSidebarGroup[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  createdBy: string | { _id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageRequest {
  title: string;
  status?: PageStatus;
  description?: string;
  contentBlocks?: PageContentBlock[];
  collegeFilter?: Partial<PageCollegeFilter>;
  sidebarLinks?: PageSidebarGroup[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {}

export interface PublishPageRequest {
  status: 'published' | 'draft' | 'archived';
}
