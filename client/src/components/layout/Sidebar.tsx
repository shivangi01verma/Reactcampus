import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/config/permissions';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  GraduationCap,
  FileText,
  ClipboardList,
  Users,
  Shield,
  Star,
  Search,
  Tag,
  MessageSquare,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Newspaper,
  Settings2,
  UserCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  permission?: string;
  anyPermission?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, permission: PERMISSIONS.DASHBOARD_VIEW },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" />, permission: PERMISSIONS.DASHBOARD_ANALYTICS },
  { label: 'Categories', path: '/admin/categories', icon: <Tag className="h-5 w-5" />, permission: PERMISSIONS.CATEGORY_READ },
  { label: 'Colleges', path: '/admin/colleges', icon: <Building2 className="h-5 w-5" />, anyPermission: [PERMISSIONS.COLLEGE_READ, PERMISSIONS.COLLEGE_READ_ASSIGNED] },
  { label: 'Courses', path: '/admin/courses', icon: <GraduationCap className="h-5 w-5" />, permission: PERMISSIONS.COURSE_READ },
  { label: 'Exams', path: '/admin/exams', icon: <BookOpen className="h-5 w-5" />, permission: PERMISSIONS.EXAM_READ },
  { label: 'Pages', path: '/admin/pages', icon: <Newspaper className="h-5 w-5" />, anyPermission: [PERMISSIONS.PAGE_READ, PERMISSIONS.PAGE_READ_ASSIGNED] },
  { label: 'Forms', path: '/admin/forms', icon: <FileText className="h-5 w-5" />, permission: PERMISSIONS.FORM_READ },
  { label: 'Leads', path: '/admin/leads', icon: <ClipboardList className="h-5 w-5" />, permission: PERMISSIONS.LEAD_READ },
  { label: 'Reviews', path: '/admin/reviews', icon: <Star className="h-5 w-5" />, permission: PERMISSIONS.REVIEW_READ },
  { label: 'Discussions', path: '/admin/discussions', icon: <MessageCircle className="h-5 w-5" />, permission: PERMISSIONS.DISCUSSION_READ },
  { label: 'Assignments', path: '/admin/assignments', icon: <UserCheck className="h-5 w-5" />, permission: PERMISSIONS.ASSIGNMENT_READ },
  { label: 'SEO', path: '/admin/seo', icon: <Search className="h-5 w-5" />, permission: PERMISSIONS.SEO_READ },
  { label: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" />, permission: PERMISSIONS.USER_READ },
  { label: 'Roles', path: '/admin/roles', icon: <Shield className="h-5 w-5" />, permission: PERMISSIONS.ROLE_READ },
  { label: 'Submissions', path: '/admin/submissions', icon: <MessageSquare className="h-5 w-5" />, permission: PERMISSIONS.FORM_VIEW_SUBMISSIONS },
  { label: 'Site Settings', path: '/admin/site-settings', icon: <Settings2 className="h-5 w-5" />, permission: PERMISSIONS.SITE_SETTINGS_READ },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { hasPermission, hasAnyPermission } = useAuth();

  const visibleItems = navItems.filter((item) => {
    if (item.anyPermission) return hasAnyPermission(...item.anyPermission);
    return !item.permission || hasPermission(item.permission);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-30 flex flex-col',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold">CampusOption</span>}
        <button onClick={onToggle} className="text-gray-400 hover:text-white">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
