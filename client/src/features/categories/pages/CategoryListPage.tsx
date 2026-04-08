import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { Category } from '@/types/category';

export default function CategoryListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useCategories({ page, limit: 20, search });
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Name' },
    { key: 'icon', header: 'Icon', render: (c) => c.icon || '-' },
    { key: 'order', header: 'Order', render: (c) => String(c.order) },
    {
      key: 'isActive', header: 'Status', render: (c) => (
        <PermissionGuard permission={PERMISSIONS.CATEGORY_UPDATE} fallback={
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {c.isActive ? 'Active' : 'Inactive'}
          </span>
        }>
          <button
            onClick={() => updateCategory.mutate({ id: c._id, data: { isActive: !c.isActive } })}
            className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${c.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {c.isActive ? 'Active' : 'Inactive'}
          </button>
        </PermissionGuard>
      ),
    },
    {
      key: 'actions', header: 'Actions', render: (c) => (
        <div className="flex gap-2">
          <PermissionGuard permission={PERMISSIONS.CATEGORY_UPDATE}>
            <Link to={`/admin/categories/${c._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.CATEGORY_DELETE}>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(c._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <PermissionGuard permission={PERMISSIONS.CATEGORY_CREATE}>
          <Link to="/admin/categories/new"><Button><Plus className="h-4 w-4 mr-2" />Add Category</Button></Link>
        </PermissionGuard>
      </div>
      <SearchInput value={search} onChange={handleSearch} />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteCategory.mutate(deleteId); setDeleteId(null); } }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
