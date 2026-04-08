import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useColleges, useDeleteCollege, usePublishCollege } from '../hooks/useColleges';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { COLLEGE_STATUS_COLORS } from '@/config/constants';
import { Plus, Edit, Trash2, Globe, FileText, Eye } from 'lucide-react';
import type { College } from '@/types/college';

export default function CollegeListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useColleges({ page, limit: 20, search });
  const deleteCollege = useDeleteCollege(); const publishCollege = usePublishCollege();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const columns: Column<College>[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type', render: (c) => <span className="capitalize">{c.type}</span> },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} colorMap={COLLEGE_STATUS_COLORS} /> },
    { key: 'location', header: 'City', render: (c) => c.location?.city || '-' },
    { key: 'actions', header: 'Actions', render: (c) => (
      <div className="flex gap-2">
        <Link to={`/admin/colleges/${c._id}`}><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></Link>
        <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_UPDATE, PERMISSIONS.COLLEGE_UPDATE_ASSIGNED]}><Link to={`/admin/colleges/${c._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard>
        <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_READ}><Link to={`/admin/colleges/${c._id}/sections`}><Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button></Link></PermissionGuard>
        <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_PUBLISH, PERMISSIONS.COLLEGE_PUBLISH_ASSIGNED]}><Button variant="ghost" size="sm" onClick={() => publishCollege.mutate({ id: c._id, data: { status: c.status === 'published' ? 'draft' : 'published' } })}><Globe className={`h-4 w-4 ${c.status === 'published' ? 'text-green-600' : 'text-gray-400'}`} /></Button></PermissionGuard>
        <PermissionGuard anyPermission={[PERMISSIONS.COLLEGE_DELETE, PERMISSIONS.COLLEGE_DELETE_ASSIGNED]}><Button variant="ghost" size="sm" onClick={() => setDeleteId(c._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Colleges</h1><PermissionGuard permission={PERMISSIONS.COLLEGE_CREATE}><Link to="/admin/colleges/new"><Button><Plus className="h-4 w-4 mr-2" />Add College</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCollege.mutate(deleteId); setDeleteId(null); } }} title="Delete College" message="Are you sure?" confirmLabel="Delete" isLoading={deleteCollege.isPending} />
    </div>
  );
}
