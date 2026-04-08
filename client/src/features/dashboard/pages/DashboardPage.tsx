import { useDashboardStats, useDashboardPipeline, useDashboardActivity } from '../hooks/useDashboard';
import { StatsGrid } from '../components/StatsGrid';
import { PipelineChart } from '../components/PipelineChart';
import { ActivityFeed } from '../components/ActivityFeed';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: pipeline, isLoading: pipelineLoading } = useDashboardPipeline();
  const { data: activity, isLoading: activityLoading } = useDashboardActivity();

  if (statsLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      {stats && <StatsGrid stats={stats} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGuard permission={PERMISSIONS.LEAD_READ}>
          {pipelineLoading ? <LoadingOverlay /> : pipeline && <PipelineChart data={pipeline} />}
        </PermissionGuard>
        {activityLoading ? <LoadingOverlay /> : activity && <ActivityFeed items={activity} />}
      </div>
    </div>
  );
}
