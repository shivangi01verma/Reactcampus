import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { PERMISSIONS } from '@/config/permissions';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UserListPage = lazy(() => import('@/features/users/pages/UserListPage'));
const UserFormPage = lazy(() => import('@/features/users/pages/UserFormPage'));
const RoleListPage = lazy(() => import('@/features/roles/pages/RoleListPage'));
const RoleFormPage = lazy(() => import('@/features/roles/pages/RoleFormPage'));
const CategoryListPage = lazy(() => import('@/features/categories/pages/CategoryListPage'));
const CategoryFormPage = lazy(() => import('@/features/categories/pages/CategoryFormPage'));
const CollegeListPage = lazy(() => import('@/features/colleges/pages/CollegeListPage'));
const CollegeFormPage = lazy(() => import('@/features/colleges/pages/CollegeFormPage'));
const ContentSectionListPage = lazy(() => import('@/features/content-sections/pages/ContentSectionListPage'));
const CourseListPage = lazy(() => import('@/features/courses/pages/CourseListPage'));
const CourseFormPage = lazy(() => import('@/features/courses/pages/CourseFormPage'));
const ExamListPage = lazy(() => import('@/features/exams/pages/ExamListPage'));
const ExamFormPage = lazy(() => import('@/features/exams/pages/ExamFormPage'));
const FormListPage = lazy(() => import('@/features/forms/pages/FormListPage'));
const FormBuilderPage = lazy(() => import('@/features/forms/pages/FormBuilderPage'));
const SubmissionListPage = lazy(() => import('@/features/forms/pages/SubmissionListPage'));
const LeadListPage = lazy(() => import('@/features/leads/pages/LeadListPage'));
const LeadDetailPage = lazy(() => import('@/features/leads/pages/LeadDetailPage'));
const LeadPipelinePage = lazy(() => import('@/features/leads/pages/LeadPipelinePage'));
const ReviewListPage = lazy(() => import('@/features/reviews/pages/ReviewListPage'));
const DiscussionListPage = lazy(() => import('@/features/discussions/pages/DiscussionListPage'));
const PageListPage = lazy(() => import('@/features/pages/pages/PageListPage'));
const PageFormPage = lazy(() => import('@/features/pages/pages/PageFormPage'));
const SeoListPage = lazy(() => import('@/features/seo/pages/SeoListPage'));
const SeoFormPage = lazy(() => import('@/features/seo/pages/SeoFormPage'));
const AssignmentListPage = lazy(() => import('@/features/assignments/pages/AssignmentListPage'));
const AssignmentFormPage = lazy(() => import('@/features/assignments/pages/AssignmentFormPage'));
const SiteSettingsPage = lazy(() => import('@/features/site-settings/pages/SiteSettingsPage'));
const ProfilePage = lazy(() => import('@/features/settings/pages/ProfilePage'));
const ChangePasswordPage = lazy(() => import('@/features/settings/pages/ChangePasswordPage'));
const AnalyticsPage = lazy(() => import('@/features/dashboard/pages/AnalyticsPage'));

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <AuthGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <PermissionGuard permission={PERMISSIONS.DASHBOARD_VIEW} fallback={<AccessDenied />}><DashboardPage /></PermissionGuard> },
        { path: 'analytics', element: <PermissionGuard permission={PERMISSIONS.DASHBOARD_ANALYTICS} fallback={<AccessDenied />}><AnalyticsPage /></PermissionGuard> },
        { path: 'users', element: <PermissionGuard permission={PERMISSIONS.USER_READ} fallback={<AccessDenied />}><UserListPage /></PermissionGuard> },
        { path: 'users/new', element: <PermissionGuard permission={PERMISSIONS.USER_CREATE} fallback={<AccessDenied />}><UserFormPage /></PermissionGuard> },
        { path: 'users/:id/edit', element: <PermissionGuard permission={PERMISSIONS.USER_UPDATE} fallback={<AccessDenied />}><UserFormPage /></PermissionGuard> },
        { path: 'roles', element: <PermissionGuard permission={PERMISSIONS.ROLE_READ} fallback={<AccessDenied />}><RoleListPage /></PermissionGuard> },
        { path: 'roles/new', element: <PermissionGuard permission={PERMISSIONS.ROLE_CREATE} fallback={<AccessDenied />}><RoleFormPage /></PermissionGuard> },
        { path: 'roles/:id/edit', element: <PermissionGuard permission={PERMISSIONS.ROLE_UPDATE} fallback={<AccessDenied />}><RoleFormPage /></PermissionGuard> },
        { path: 'categories', element: <PermissionGuard permission={PERMISSIONS.CATEGORY_READ} fallback={<AccessDenied />}><CategoryListPage /></PermissionGuard> },
        { path: 'categories/new', element: <PermissionGuard permission={PERMISSIONS.CATEGORY_CREATE} fallback={<AccessDenied />}><CategoryFormPage /></PermissionGuard> },
        { path: 'categories/:id', element: <PermissionGuard permission={PERMISSIONS.CATEGORY_READ} fallback={<AccessDenied />}><CategoryFormPage /></PermissionGuard> },
        { path: 'categories/:id/edit', element: <PermissionGuard permission={PERMISSIONS.CATEGORY_UPDATE} fallback={<AccessDenied />}><CategoryFormPage /></PermissionGuard> },
        { path: 'colleges', element: <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_READ, PERMISSIONS.COLLEGE_READ_ASSIGNED]} fallback={<AccessDenied />}><CollegeListPage /></PermissionGuard> },
        { path: 'colleges/new', element: <PermissionGuard permission={PERMISSIONS.COLLEGE_CREATE} fallback={<AccessDenied />}><CollegeFormPage /></PermissionGuard> },
        { path: 'colleges/:id', element: <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_READ, PERMISSIONS.COLLEGE_READ_ASSIGNED]} fallback={<AccessDenied />}><CollegeFormPage /></PermissionGuard> },
        { path: 'colleges/:id/edit', element: <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_UPDATE, PERMISSIONS.COLLEGE_UPDATE_ASSIGNED]} fallback={<AccessDenied />}><CollegeFormPage /></PermissionGuard> },
        { path: 'colleges/:collegeId/sections', element: <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_READ} fallback={<AccessDenied />}><ContentSectionListPage /></PermissionGuard> },
        { path: 'courses', element: <PermissionGuard permission={PERMISSIONS.COURSE_READ} fallback={<AccessDenied />}><CourseListPage /></PermissionGuard> },
        { path: 'courses/new', element: <PermissionGuard permission={PERMISSIONS.COURSE_CREATE} fallback={<AccessDenied />}><CourseFormPage /></PermissionGuard> },
        { path: 'courses/:id', element: <PermissionGuard permission={PERMISSIONS.COURSE_READ} fallback={<AccessDenied />}><CourseFormPage /></PermissionGuard> },
        { path: 'courses/:id/edit', element: <PermissionGuard permission={PERMISSIONS.COURSE_UPDATE} fallback={<AccessDenied />}><CourseFormPage /></PermissionGuard> },
        { path: 'courses/:courseId/sections', element: <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_READ} fallback={<AccessDenied />}><ContentSectionListPage /></PermissionGuard> },
        { path: 'exams', element: <PermissionGuard permission={PERMISSIONS.EXAM_READ} fallback={<AccessDenied />}><ExamListPage /></PermissionGuard> },
        { path: 'exams/new', element: <PermissionGuard permission={PERMISSIONS.EXAM_CREATE} fallback={<AccessDenied />}><ExamFormPage /></PermissionGuard> },
        { path: 'exams/:id', element: <PermissionGuard permission={PERMISSIONS.EXAM_READ} fallback={<AccessDenied />}><ExamFormPage /></PermissionGuard> },
        { path: 'exams/:id/edit', element: <PermissionGuard permission={PERMISSIONS.EXAM_UPDATE} fallback={<AccessDenied />}><ExamFormPage /></PermissionGuard> },
        { path: 'exams/:examId/sections', element: <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_READ} fallback={<AccessDenied />}><ContentSectionListPage /></PermissionGuard> },
        { path: 'forms', element: <PermissionGuard permission={PERMISSIONS.FORM_READ} fallback={<AccessDenied />}><FormListPage /></PermissionGuard> },
        { path: 'forms/new', element: <PermissionGuard permission={PERMISSIONS.FORM_CREATE} fallback={<AccessDenied />}><FormBuilderPage /></PermissionGuard> },
        { path: 'forms/:id/edit', element: <PermissionGuard permission={PERMISSIONS.FORM_UPDATE} fallback={<AccessDenied />}><FormBuilderPage /></PermissionGuard> },
        { path: 'submissions', element: <PermissionGuard permission={PERMISSIONS.FORM_VIEW_SUBMISSIONS} fallback={<AccessDenied />}><SubmissionListPage /></PermissionGuard> },
        { path: 'leads', element: <PermissionGuard permission={PERMISSIONS.LEAD_READ} fallback={<AccessDenied />}><LeadListPage /></PermissionGuard> },
        { path: 'leads/pipeline', element: <PermissionGuard permission={PERMISSIONS.LEAD_READ} fallback={<AccessDenied />}><LeadPipelinePage /></PermissionGuard> },
        { path: 'leads/:id', element: <PermissionGuard permission={PERMISSIONS.LEAD_READ} fallback={<AccessDenied />}><LeadDetailPage /></PermissionGuard> },
        { path: 'reviews', element: <PermissionGuard permission={PERMISSIONS.REVIEW_READ} fallback={<AccessDenied />}><ReviewListPage /></PermissionGuard> },
        { path: 'discussions', element: <PermissionGuard permission={PERMISSIONS.DISCUSSION_READ} fallback={<AccessDenied />}><DiscussionListPage /></PermissionGuard> },
        { path: 'pages', element: <PermissionGuard anyPermission={[PERMISSIONS.PAGE_READ, PERMISSIONS.PAGE_READ_ASSIGNED]} fallback={<AccessDenied />}><PageListPage /></PermissionGuard> },
        { path: 'pages/new', element: <PermissionGuard permission={PERMISSIONS.PAGE_CREATE} fallback={<AccessDenied />}><PageFormPage /></PermissionGuard> },
        { path: 'pages/:id', element: <PermissionGuard anyPermission={[PERMISSIONS.PAGE_READ, PERMISSIONS.PAGE_READ_ASSIGNED]} fallback={<AccessDenied />}><PageFormPage /></PermissionGuard> },
        { path: 'pages/:id/edit', element: <PermissionGuard anyPermission={[PERMISSIONS.PAGE_UPDATE, PERMISSIONS.PAGE_UPDATE_ASSIGNED]} fallback={<AccessDenied />}><PageFormPage /></PermissionGuard> },
        { path: 'seo', element: <PermissionGuard permission={PERMISSIONS.SEO_READ} fallback={<AccessDenied />}><SeoListPage /></PermissionGuard> },
        { path: 'seo/new', element: <PermissionGuard permission={PERMISSIONS.SEO_CREATE} fallback={<AccessDenied />}><SeoFormPage /></PermissionGuard> },
        { path: 'seo/:id/edit', element: <PermissionGuard permission={PERMISSIONS.SEO_UPDATE} fallback={<AccessDenied />}><SeoFormPage /></PermissionGuard> },
        { path: 'assignments', element: <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_READ} fallback={<AccessDenied />}><AssignmentListPage /></PermissionGuard> },
        { path: 'assignments/new', element: <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_CREATE} fallback={<AccessDenied />}><AssignmentFormPage /></PermissionGuard> },
        { path: 'assignments/:id/edit', element: <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_UPDATE} fallback={<AccessDenied />}><AssignmentFormPage /></PermissionGuard> },
        { path: 'site-settings', element: <PermissionGuard permission={PERMISSIONS.SITE_SETTINGS_READ} fallback={<AccessDenied />}><SiteSettingsPage /></PermissionGuard> },
        { path: 'settings/profile', element: <ProfilePage /> },
        { path: 'settings/password', element: <ChangePasswordPage /> },
      ],
    },
  ],
};
