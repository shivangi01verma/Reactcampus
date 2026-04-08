import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads, useDeleteLead, useLeadStats, useChangeLeadStatus, useBulkLeadAction } from '../hooks/useLeads';
import { useUsers } from '@/features/users/hooks/useUsers';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Card } from '@/components/ui/Card';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { LEAD_STATUSES, LEAD_PRIORITIES, LEAD_STATUS_COLORS, PRIORITY_COLORS } from '@/config/constants';
import { Eye, Trash2, Download, X, Users, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { leadApi } from '../services/leadApi';
import type { Lead } from '@/types/lead';

function formatRelativeDate(dateStr: string) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function LeadListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAssign, setBulkAssign] = useState('');

  const params = useMemo(() => ({
    page, limit: 20, search,
    status: status || undefined,
    priority: priority || undefined,
    assignedTo: assignedTo || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  }), [page, search, status, priority, assignedTo, dateFrom, dateTo]);

  const { data, isLoading } = useLeads(params);
  const { data: stats } = useLeadStats();
  const { data: usersData } = useUsers({ limit: 100 });
  const deleteLead = useDeleteLead();
  const changeStatus = useChangeLeadStatus();
  const bulkAction = useBulkLeadAction();

  const users = usersData?.data || [];

  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const clearFilters = () => {
    setSearch(''); setStatus(''); setPriority(''); setAssignedTo(''); setDateFrom(''); setDateTo(''); setPage(1);
  };

  const hasFilters = search || status || priority || assignedTo || dateFrom || dateTo;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const currentIds = (data?.data || []).map(l => l._id);
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...currentIds])]);
    }
  };

  const handleBulkStatusChange = () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    bulkAction.mutate({ ids: selectedIds, action: 'changeStatus', value: bulkStatus }, {
      onSuccess: () => { setSelectedIds([]); setBulkStatus(''); }
    });
  };

  const handleBulkAssign = () => {
    if (!bulkAssign || selectedIds.length === 0) return;
    bulkAction.mutate({ ids: selectedIds, action: 'assign', value: bulkAssign }, {
      onSuccess: () => { setSelectedIds([]); setBulkAssign(''); }
    });
  };

  const handleBulkDelete = () => {
    bulkAction.mutate({ ids: selectedIds, action: 'delete' }, {
      onSuccess: () => { setSelectedIds([]); setBulkDeleteConfirm(false); }
    });
  };

  const handleExport = async () => {
    await leadApi.export({
      status: status || undefined,
      priority: priority || undefined,
      assignedTo: assignedTo || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  };

  const handleQuickStatusChange = (leadId: string, newStatus: string) => {
    changeStatus.mutate({ id: leadId, data: { status: newStatus as any } });
  };

  // Stats calculations
  const totalOpen = stats ? (stats.byStatus['new'] || 0) + (stats.byStatus['contacted'] || 0) + (stats.byStatus['qualified'] || 0) : 0;
  const totalAll = stats ? Object.values(stats.byStatus).reduce((sum: number, c) => sum + (c as number), 0) : 0;
  const converted = stats?.byStatus['converted'] || 0;
  const conversionRate = totalAll > 0 ? ((converted / totalAll) * 100).toFixed(1) : '0';

  const allOnPageSelected = (data?.data || []).length > 0 && (data?.data || []).every(l => selectedIds.includes(l._id));

  const columns: Column<Lead>[] = [
    {
      key: 'select',
      header: '',
      className: 'w-10',
      render: (l) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(l._id)}
          onChange={() => toggleSelect(l._id)}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      key: 'lead',
      header: 'Lead',
      render: (l) => (
        <div>
          <Link to={`/admin/leads/${l._id}`} className="font-medium text-blue-600 hover:underline">{l.name}</Link>
          <p className="text-xs text-gray-500">{l.email || l.phone || '-'}</p>
        </div>
      ),
    },
    {
      key: 'college',
      header: 'College',
      render: (l: any) => (
        <span className="text-sm text-gray-700">{l.college?.name || '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => (
        <select
          value={l.status}
          onChange={(e) => handleQuickStatusChange(l._id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${LEAD_STATUS_COLORS[l.status] || 'bg-gray-100'}`}
        >
          {LEAD_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (l) => <StatusBadge status={l.priority} colorMap={PRIORITY_COLORS} />,
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (l: any) => {
        if (l.assignedTo && typeof l.assignedTo === 'object') {
          const initials = `${l.assignedTo.firstName?.[0] || ''}${l.assignedTo.lastName?.[0] || ''}`.toUpperCase();
          return (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{initials}</span>
              <span className="text-sm">{l.assignedTo.firstName} {l.assignedTo.lastName}</span>
            </div>
          );
        }
        return <span className="text-xs text-gray-400">Unassigned</span>;
      },
    },
    {
      key: 'age',
      header: 'Age',
      render: (l) => <span className="text-xs text-gray-500">{formatRelativeDate(l.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (l) => (
        <div className="flex gap-1">
          <Link to={`/admin/leads/${l._id}`}>
            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          </Link>
          <PermissionGuard permission={PERMISSIONS.LEAD_DELETE}>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(l._id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Link to="/admin/leads/pipeline">
          <Button variant="outline">Pipeline View</Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-500">New Today</p>
              <p className="text-xl font-bold">{stats?.newToday ?? '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg"><BarChart3 className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-xl font-bold">{stats?.newThisWeek ?? '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg"><Users className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total Open</p>
              <p className="text-xl font-bold">{totalOpen}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3">
        <SearchInput value={search} onChange={handleSearch} className="w-64" />
        <Select
          options={[{ label: 'All Status', value: '' }, ...LEAD_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))]}
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="w-36"
        />
        <Select
          options={[{ label: 'All Priority', value: '' }, ...LEAD_PRIORITIES.map(p => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p }))]}
          value={priority}
          onChange={e => { setPriority(e.target.value); setPage(1); }}
          className="w-36"
        />
        <Select
          options={[{ label: 'All Assignees', value: '' }, ...users.map((u: any) => ({ label: `${u.firstName} ${u.lastName}`, value: u._id }))]}
          value={assignedTo}
          onChange={e => { setAssignedTo(e.target.value); setPage(1); }}
          className="w-44"
        />
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1); }}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1); }}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <PermissionGuard permission={PERMISSIONS.LEAD_EXPORT}>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </PermissionGuard>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <span className="text-sm font-medium text-blue-800">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2">
            <Select
              options={LEAD_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              placeholder="Change Status"
              className="w-40"
            />
            <Button size="sm" onClick={handleBulkStatusChange} disabled={!bulkStatus || bulkAction.isPending}>Apply</Button>
          </div>
          <div className="flex items-center gap-2">
            <Select
              options={users.map((u: any) => ({ label: `${u.firstName} ${u.lastName}`, value: u._id }))}
              value={bulkAssign}
              onChange={e => setBulkAssign(e.target.value)}
              placeholder="Assign To"
              className="w-44"
            />
            <Button size="sm" onClick={handleBulkAssign} disabled={!bulkAssign || bulkAction.isPending}>Assign</Button>
          </div>
          <Button size="sm" variant="outline" className="!text-red-600 !border-red-300" onClick={() => setBulkDeleteConfirm(true)}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Table with select-all checkbox */}
      <div>
        {(data?.data || []).length > 0 && (
          <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={allOnPageSelected}
                onChange={toggleSelectAll}
                className="rounded border-gray-300"
              />
              Select all on page
            </label>
          </div>
        )}
        <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      </div>

      {data?.pagination && (
        <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />
      )}

      {/* Delete single confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteLead.mutate(deleteId); setDeleteId(null); } }}
        title="Delete Lead"
        message="Are you sure you want to delete this lead?"
        confirmLabel="Delete"
      />

      {/* Bulk delete confirmation */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Leads"
        message={`Are you sure you want to delete ${selectedIds.length} lead(s)?`}
        confirmLabel="Delete All"
      />
    </div>
  );
}
