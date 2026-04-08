import { Building2, GraduationCap, BookOpen, ClipboardList, Users, Globe } from 'lucide-react';
import { StatCard } from './StatCard';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/config/permissions';
import type { DashboardStats } from '@/types/dashboard';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { hasPermission } = useAuth();

  const cards = [
    { title: 'Total Colleges', value: stats.totalColleges, icon: <Building2 className="h-6 w-6 text-blue-600" />, color: 'bg-blue-100', permission: PERMISSIONS.COLLEGE_READ },
    { title: 'Published', value: stats.publishedColleges, icon: <Globe className="h-6 w-6 text-green-600" />, color: 'bg-green-100', permission: PERMISSIONS.COLLEGE_READ },
    { title: 'Courses', value: stats.totalCourses, icon: <GraduationCap className="h-6 w-6 text-purple-600" />, color: 'bg-purple-100', permission: PERMISSIONS.COURSE_READ },
    { title: 'Exams', value: stats.totalExams, icon: <BookOpen className="h-6 w-6 text-brand-600" />, color: 'bg-brand-100', permission: PERMISSIONS.EXAM_READ },
    { title: 'Leads', value: stats.totalLeads, icon: <ClipboardList className="h-6 w-6 text-yellow-600" />, color: 'bg-yellow-100', permission: PERMISSIONS.LEAD_READ },
    { title: 'Users', value: stats.totalUsers, icon: <Users className="h-6 w-6 text-indigo-600" />, color: 'bg-indigo-100', permission: PERMISSIONS.USER_READ },
  ];

  const visibleCards = cards.filter((card) => hasPermission(card.permission));

  if (visibleCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleCards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} color={card.color} />
      ))}
    </div>
  );
}
