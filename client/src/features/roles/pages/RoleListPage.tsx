import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRoles, useDeleteRole } from '../hooks/useRoles';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Role } from '@/types/role';

export default function RoleListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useRoles({ page, limit: 20, search });
  const deleteRole = useDeleteRole();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const columns: Column<Role>[] = [
    { key: 'displayName', header: 'Name' },
    { key: 'name', header: 'Key' },
    { key: 'isSystem', header: 'Type', render: (r) => <Badge variant={r.isSystem ? 'warning' : 'default'}>{r.isSystem ? 'System' : 'Custom'}</Badge> },
    { key: 'permissions', header: 'Permissions', render: (r) => <span>{Array.isArray(r.permissions) ? r.permissions.length : 0}</span> },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <PermissionGuard permission={PERMISSIONS.ROLE_UPDATE}><Link to={`/admin/roles/${r._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard>
        {!r.isSystem && <PermissionGuard permission={PERMISSIONS.ROLE_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(r._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard>}
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Roles</h1><PermissionGuard permission={PERMISSIONS.ROLE_CREATE}><Link to="/admin/roles/new"><Button><Plus className="h-4 w-4 mr-2" />Add Role</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteRole.mutate(deleteId); setDeleteId(null); } }} title="Delete Role" message="Are you sure?" confirmLabel="Delete" isLoading={deleteRole.isPending} />
    </div>
  );
}
