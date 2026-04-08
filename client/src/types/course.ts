import type { CourseLevel } from '@/config/constants';

export interface Course {
  _id: string;
  id: string;
  name: string;
  slug: string;
  level: CourseLevel;
  duration: {
    value: number;
    unit: 'years' | 'months';
  };
  stream: string;
  specializations: string[];
  fees: {
    amount: number;
    currency: string;
    per: 'year' | 'semester' | 'total';
  };
  description: string;
  eligibility: string;
  pageFeatures?: { faq: boolean; discussion: boolean };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  name: string;
  level: CourseLevel;
  duration: { value: number; unit: 'years' | 'months' };
  stream?: string;
  specializations?: string[];
  fees?: { amount: number; currency?: string; per?: string };
  description?: string;
  eligibility?: string;
  pageFeatures?: { faq?: boolean; discussion?: boolean };
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isActive?: boolean;
}
