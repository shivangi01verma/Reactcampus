import { useState, useCallback } from 'react';
import { useDiscussions, useModerateDiscussion, useDeleteDiscussion } from '../hooks/useDiscussions';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { DISCUSSION_STATUSES, DISCUSSION_STATUS_COLORS } from '@/config/constants';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import type { Discussion } from '@/types/discussion';

function getEntityName(d: Discussion): string {
  if (d.college && typeof d.college === 'object') return d.college.name;
  if (d.course && typeof d.course === 'object') return d.course.name;
  if (d.exam && typeof d.exam === 'object') return d.exam.name;
  return '-';
}

function getEntityType(d: Discussion): string {
  if (d.college) return 'College';
  if (d.course) return 'Course';
  if (d.exam) return 'Exam';
  return '-';
}

export default function DiscussionListPage() {
  const [page, setPage] = useState(1); const [status, setStatus] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useDiscussions({ page, limit: 20, status: status || undefined }); const moderate = useModerateDiscussion(); const deleteDiscussion = useDeleteDiscussion();
  const columns: Column<Discussion>[] = [
    { key: 'authorName', header: 'Author' },
    { key: 'content', header: 'Content', render: (d) => <span className="truncate block max-w-[300px]">{d.content.length > 80 ? d.content.slice(0, 80) + '...' : d.content}</span> },
    { key: 'entity', header: 'Entity', render: (d) => <span><span className="text-xs text-gray-500">{getEntityType(d)}: </span>{getEntityName(d)}</span> },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} colorMap={DISCUSSION_STATUS_COLORS} /> },
    { key: 'createdAt', header: 'Date', render: (d) => new Date(d.createdAt).toLocaleDateString() },
    { key: 'actions', header: 'Actions', render: (d) => (<div className="flex gap-2">
      {d.status === 'pending' && <PermissionGuard permission={PERMISSIONS.DISCUSSION_MODERATE}><Button variant="ghost" size="sm" onClick={() => moderate.mutate({ id: d._id, data: { status: 'approved' } })}><CheckCircle className="h-4 w-4 text-green-600" /></Button><Button variant="ghost" size="sm" onClick={() => moderate.mutate({ id: d._id, data: { status: 'rejected' } })}><XCircle className="h-4 w-4 text-red-500" /></Button></PermissionGuard>}
      <PermissionGuard permission={PERMISSIONS.DISCUSSION_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(d._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Discussions</h1>
      <div className="flex gap-4"><Select options={[{ label: 'All', value: '' }, ...DISCUSSION_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))]} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-40" /></div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteDiscussion.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure you want to delete this discussion?" confirmLabel="Delete" />
    </div>
  );
}
