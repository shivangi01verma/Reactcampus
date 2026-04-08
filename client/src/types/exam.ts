import type { ExamType } from '@/config/constants';

export interface ExamSection {
  name: string;
  questions: number;
  marks: number;
}

export interface ExamPattern {
  mode: 'online' | 'offline' | 'both';
  duration: string;
  totalMarks: number | null;
  sections: ExamSection[];
}

export interface ImportantDate {
  event: string;
  date: string;
  description: string;
}

export interface Exam {
  _id: string;
  id: string;
  name: string;
  slug: string;
  conductedBy: string;
  examType: ExamType;
  categories: string[];
  pattern: ExamPattern;
  importantDates: ImportantDate[];
  eligibility: string;
  description: string;
  website: string;
  pageFeatures?: { faq: boolean; discussion: boolean };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamRequest {
  name: string;
  examType: ExamType;
  categories?: string[];
  conductedBy?: string;
  pattern?: Partial<ExamPattern>;
  importantDates?: ImportantDate[];
  eligibility?: string;
  description?: string;
  website?: string;
  pageFeatures?: { faq?: boolean; discussion?: boolean };
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {
  isActive?: boolean;
}
