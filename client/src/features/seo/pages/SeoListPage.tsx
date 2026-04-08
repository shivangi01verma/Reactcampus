import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSeoEntries, useDeleteSeo } from '../hooks/useSeo';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { SEO } from '@/types/seo';

export default function SeoListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useSeoEntries({ page, limit: 20, search }); const deleteSeo = useDeleteSeo();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<SEO>[] = [
    { key: 'targetType', header: 'Type', render: (s) => <Badge>{s.targetType}</Badge> }, { key: 'metaTitle', header: 'Meta Title', render: (s) => s.metaTitle || '-' },
    { key: 'actions', header: 'Actions', render: (s) => (<div className="flex gap-2"><PermissionGuard permission={PERMISSIONS.SEO_UPDATE}><Link to={`/admin/seo/${s._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.SEO_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(s._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">SEO</h1><PermissionGuard permission={PERMISSIONS.SEO_CREATE}><Link to="/admin/seo/new"><Button><Plus className="h-4 w-4 mr-2" />Add SEO</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} /><DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteSeo.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
