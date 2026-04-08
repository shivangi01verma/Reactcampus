import type { SeoTargetType } from '@/config/constants';

export interface SEO {
  _id: string;
  id: string;
  targetType: SeoTargetType;
  targetId: string | null;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  structuredData: unknown;
  robots: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeoRequest {
  targetType: SeoTargetType;
  targetId?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: unknown;
  robots?: string;
}

export interface UpdateSeoRequest extends Partial<CreateSeoRequest> {}
