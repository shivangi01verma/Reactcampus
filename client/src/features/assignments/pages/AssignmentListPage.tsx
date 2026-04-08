import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAssignments, useDeleteAssignment } from '../hooks/useAssignments';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { ContentAssignment } from '@/types/contentAssignment';

export default function AssignmentListPage() {
  const [page, setPage] = useState(1);
  const [contentType, setContentType] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const params: Record<string, any> = { page, limit: 20 };
  if (contentType) params.contentType = contentType;

  const { data, isLoading } = useAssignments(params);
  const deleteAssignment = useDeleteAssignment();

  const handleContentTypeChange = useCallback((val: string) => {
    setContentType(val);
    setPage(1);
  }, []);

  const columns: Column<ContentAssignment>[] = [
    {
      key: 'user',
      header: 'User',
      render: (a) => `${a.user.firstName} ${a.user.lastName}`,
    },
    {
      key: 'contentType',
      header: 'Content Type',
      render: (a) => <span className="capitalize">{a.contentType}</span>,
    },
    {
      key: 'scope',
      header: 'Scope',
      render: (a) => <span className="capitalize">{a.scope}</span>,
    },
    {
      key: 'detail',
      header: 'Content / Categories',
      render: (a) =>
        a.scope === 'individual' ? (
          <span className="text-sm text-gray-500">{a.contentId || '-'}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {a.categories.map((cat) => (
              <span key={cat} className="inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                {cat}
              </span>
            ))}
          </div>
        ),
    },
    {
      key: 'actions_list',
      header: 'Actions',
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.actions.map((action) => (
            <span key={action} className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800 capitalize">
              {action}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'assignedBy',
      header: 'Assigned By',
      render: (a) => `${a.assignedBy.firstName} ${a.assignedBy.lastName}`,
    },
    {
      key: 'row_actions',
      header: '',
      render: (a) => (
        <div className="flex gap-2">
          <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_UPDATE}>
            <Link to={`/admin/assignments/${a._id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_DELETE}>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(a._id)}>
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
        <h1 className="text-2xl font-bold">Content Assignments</h1>
        <PermissionGuard permission={PERMISSIONS.ASSIGNMENT_CREATE}>
          <Link to="/admin/assignments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </Link>
        </PermissionGuard>
      </div>

      <div className="flex gap-4">
        <select
          value={contentType}
          onChange={(e) => handleContentTypeChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="college">College</option>
          <option value="page">Page</option>
        </select>
      </div>

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />

      {data?.pagination && (
        <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteAssignment.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment?"
        confirmLabel="Delete"
        isLoading={deleteAssignment.isPending}
      />
    </div>
  );
}
