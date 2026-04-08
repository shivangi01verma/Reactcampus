import { useState, useCallback } from 'react';
import { useReviews, useModerateReview, useDeleteReview } from '../hooks/useReviews';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StarRating } from '@/components/ui/StarRating';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { REVIEW_STATUSES, REVIEW_STATUS_COLORS } from '@/config/constants';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import type { Review } from '@/types/review';

export default function ReviewListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useReviews({ page, limit: 20, search, status: status || undefined }); const moderate = useModerateReview(); const deleteReview = useDeleteReview();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<Review>[] = [
    { key: 'authorName', header: 'Author' }, { key: 'rating', header: 'Rating', render: (r) => <StarRating rating={r.rating} size="sm" /> },
    { key: 'title', header: 'Title', render: (r) => r.title || '-' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} colorMap={REVIEW_STATUS_COLORS} /> },
    { key: 'actions', header: 'Actions', render: (r) => (<div className="flex gap-2">
      {r.status === 'pending' && <PermissionGuard permission={PERMISSIONS.REVIEW_MODERATE}><Button variant="ghost" size="sm" onClick={() => moderate.mutate({ id: r._id, data: { status: 'approved' } })}><CheckCircle className="h-4 w-4 text-green-600" /></Button><Button variant="ghost" size="sm" onClick={() => moderate.mutate({ id: r._id, data: { status: 'rejected' } })}><XCircle className="h-4 w-4 text-red-500" /></Button></PermissionGuard>}
      <PermissionGuard permission={PERMISSIONS.REVIEW_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(r._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Reviews</h1>
      <div className="flex gap-4"><SearchInput value={search} onChange={handleSearch} className="flex-1" /><Select options={[{ label: 'All', value: '' }, ...REVIEW_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))]} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-40" /></div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteReview.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
