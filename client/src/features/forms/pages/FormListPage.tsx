import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useForms, useDeleteForm, usePublishForm } from '../hooks/useForms';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
import type { DynamicForm } from '@/types/form';

export default function FormListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useForms({ page, limit: 20, search }); const deleteForm = useDeleteForm(); const publishForm = usePublishForm();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<DynamicForm>[] = [
    { key: 'title', header: 'Title' }, { key: 'slug', header: 'Slug' },
    { key: 'purpose', header: 'Purpose', render: (f) => <span className="capitalize">{f.purpose}</span> },
    { key: 'isPublished', header: 'Status', render: (f) => <Badge variant={f.isPublished ? 'success' : 'warning'}>{f.isPublished ? 'Published' : 'Draft'}</Badge> },
    { key: 'actions', header: 'Actions', render: (f) => (<div className="flex gap-2"><PermissionGuard permission={PERMISSIONS.FORM_UPDATE}><Link to={`/admin/forms/${f._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.FORM_PUBLISH}><Button variant="ghost" size="sm" onClick={() => publishForm.mutate({ id: f._id, isPublished: !f.isPublished })}><Globe className={`h-4 w-4 ${f.isPublished ? 'text-green-600' : 'text-gray-400'}`} /></Button></PermissionGuard><PermissionGuard permission={PERMISSIONS.FORM_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(f._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Forms</h1><PermissionGuard permission={PERMISSIONS.FORM_CREATE}><Link to="/admin/forms/new"><Button><Plus className="h-4 w-4 mr-2" />Create Form</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} /><DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteForm.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
