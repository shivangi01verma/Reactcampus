import { useLeads } from '../hooks/useLeads';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Button } from '@/components/ui/Button';
import { LEAD_STATUSES, LEAD_STATUS_COLORS, PRIORITY_COLORS } from '@/config/constants';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PRIORITY_DOT_COLORS: Record<string, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-500',
};

function formatAge(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

export default function LeadPipelinePage() {
  const { data, isLoading } = useLeads({ limit: 200 });
  if (isLoading) return <LoadingOverlay />;
  const leads = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/admin/leads"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button></Link>
        <h1 className="text-2xl font-bold">Lead Pipeline</h1>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STATUSES.map(status => {
          const items = leads.filter(l => l.status === status);
          return (
            <div key={status} className="min-w-[280px] flex-shrink-0 bg-gray-50 rounded-lg p-3">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={status} colorMap={LEAD_STATUS_COLORS} />
                <span className="text-sm font-medium text-gray-600 bg-gray-200 rounded-full px-2 py-0.5">{items.length}</span>
              </div>
              {/* Cards */}
              <div className="space-y-2">
                {items.map(lead => {
                  const assigned = lead.assignedTo && typeof lead.assignedTo === 'object' ? lead.assignedTo : null;
                  const initials = assigned
                    ? `${(assigned as any).firstName?.[0] || ''}${(assigned as any).lastName?.[0] || ''}`.toUpperCase()
                    : null;

                  return (
                    <Card key={lead._id} className="!p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <Link to={`/admin/leads/${lead._id}`} className="block">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{lead.name}</p>
                            <p className="text-xs text-gray-500 truncate">{lead.email || lead.phone || '-'}</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2 shrink-0">{formatAge(lead.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT_COLORS[lead.priority] || 'bg-gray-400'}`} title={lead.priority} />
                            <span className="text-xs text-gray-500 capitalize">{lead.priority}</span>
                          </div>
                          {initials && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium" title={`${(assigned as any).firstName} ${(assigned as any).lastName}`}>
                              {initials}
                            </span>
                          )}
                        </div>
                      </Link>
                    </Card>
                  );
                })}
                {items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No leads</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
