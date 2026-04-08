import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePages, useDeletePage, usePublishPage } from '../hooks/usePages';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { PAGE_STATUS_COLORS } from '@/config/constants';
import { Plus, Edit, Trash2, Globe, Eye } from 'lucide-react';
import type { Page } from '@/types/page';

export default function PageListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = usePages({ page, limit: 20, search });
  const deletePage = useDeletePage();
  const publishPage = usePublishPage();

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const columns: Column<Page>[] = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug', render: (p) => <span className="text-gray-500 text-sm">{p.slug}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusBadge status={p.status} colorMap={PAGE_STATUS_COLORS} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (p) => new Date(p.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex gap-2">
          <Link to={`/admin/pages/${p._id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <PermissionGuard anyPermission={[PERMISSIONS.PAGE_UPDATE, PERMISSIONS.PAGE_UPDATE_ASSIGNED]}>
            <Link to={`/admin/pages/${p._id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </PermissionGuard>

          <PermissionGuard anyPermission={[PERMISSIONS.PAGE_PUBLISH, PERMISSIONS.PAGE_PUBLISH_ASSIGNED]}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                publishPage.mutate({
                  id: p._id,
                  data: { status: p.status === 'published' ? 'draft' : 'published' },
                })
              }
            >
              <Globe className={`h-4 w-4 ${p.status === 'published' ? 'text-green-600' : 'text-gray-400'}`} />
            </Button>
          </PermissionGuard>

          <PermissionGuard anyPermission={[PERMISSIONS.PAGE_DELETE, PERMISSIONS.PAGE_DELETE_ASSIGNED]}>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(p._id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        <PermissionGuard permission={PERMISSIONS.PAGE_CREATE}>
          <Link to="/admin/pages/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </Link>
        </PermissionGuard>
      </div>

      <SearchInput value={search} onChange={handleSearch} />

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />

      {data?.pagination && (
        <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deletePage.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Page"
        message="Are you sure you want to delete this page?"
        confirmLabel="Delete"
        isLoading={deletePage.isPending}
      />
    </div>
  );
}
