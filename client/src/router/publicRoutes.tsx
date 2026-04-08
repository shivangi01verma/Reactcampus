import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';

const HomePage = lazy(() => import('@/features/public-home/pages/HomePage'));
const CollegeListingPage = lazy(() => import('@/features/public-colleges/pages/CollegeListingPage'));
const CollegeDetailPage = lazy(() => import('@/features/public-colleges/pages/CollegeDetailPage'));
const CourseListingPage = lazy(() => import('@/features/public-courses/pages/CourseListingPage'));
const CourseDetailPage = lazy(() => import('@/features/public-courses/pages/CourseDetailPage'));
const ExamListingPage = lazy(() => import('@/features/public-exams/pages/ExamListingPage'));
const ExamDetailPage = lazy(() => import('@/features/public-exams/pages/ExamDetailPage'));
const DynamicFormRenderer = lazy(() => import('@/features/public-forms/components/DynamicFormRenderer'));
const DynamicPage = lazy(() => import('@/features/public-pages/pages/DynamicPage'));
const AboutPage = lazy(() => import('@/features/public-about/pages/AboutPage'));
const ContactPage = lazy(() => import('@/features/public-contact/pages/ContactPage'));
const LoanPage = lazy(() => import('@/features/public-pages/pages/LoanPage'));

export const publicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'colleges', element: <CollegeListingPage /> },
    { path: 'colleges/:slug', element: <CollegeDetailPage /> },
    { path: 'courses', element: <CourseListingPage /> },
    { path: 'courses/:slug', element: <CourseDetailPage /> },
    { path: 'exams', element: <ExamListingPage /> },
    { path: 'exams/:slug', element: <ExamDetailPage /> },
    { path: 'about', element: <AboutPage /> },
    { path: 'loan', element: <LoanPage /> },
    { path: 'contact', element: <ContactPage /> },
    { path: 'forms/:slug', element: <DynamicFormRenderer /> },
    { path: 'pages/:slug', element: <DynamicPage /> },
  ],
};
