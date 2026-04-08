import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCourses, useDeleteCourse } from '../hooks/useCourses';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import type { Course } from '@/types/course';

export default function CourseListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useCourses({ page, limit: 20, search });
  const deleteCourse = useDeleteCourse();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<Course>[] = [
    { key: 'name', header: 'Name' }, { key: 'level', header: 'Level', render: (c) => <span className="capitalize">{c.level}</span> },
    { key: 'duration', header: 'Duration', render: (c) => `${c.duration.value} ${c.duration.unit}` },
    { key: 'stream', header: 'Stream', render: (c) => c.stream || '-' },
    { key: 'isActive', header: 'Status', render: (c) => <Badge variant={c.isActive ? 'success' : 'danger'}>{c.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', header: 'Actions', render: (c) => (<div className="flex gap-2"><Link to={`/admin/courses/${c._id}`}><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></Link><PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_READ}><Link to={`/admin/courses/${c._id}/sections`}><Button variant="ghost" size="sm" title="Content Sections"><FileText className="h-4 w-4" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.COURSE_UPDATE}><Link to={`/admin/courses/${c._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.COURSE_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(c._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Courses</h1><PermissionGuard permission={PERMISSIONS.COURSE_CREATE}><Link to="/admin/courses/new"><Button><Plus className="h-4 w-4 mr-2" />Add Course</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} /><DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCourse.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" isLoading={deleteCourse.isPending} />
    </div>
  );
}
