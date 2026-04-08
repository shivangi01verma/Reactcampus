import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useExams, useDeleteExam } from '../hooks/useExams';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import type { Exam } from '@/types/exam';

export default function ExamListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useExams({ page, limit: 20, search }); const deleteExam = useDeleteExam();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<Exam>[] = [
    { key: 'name', header: 'Name' }, { key: 'examType', header: 'Type', render: (e) => <span className="capitalize">{e.examType}</span> },
    { key: 'conductedBy', header: 'Conducted By', render: (e) => e.conductedBy || '-' },
    { key: 'isActive', header: 'Status', render: (e) => <Badge variant={e.isActive ? 'success' : 'danger'}>{e.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', header: 'Actions', render: (e) => (<div className="flex gap-2"><Link to={`/admin/exams/${e._id}`}><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></Link><PermissionGuard permission={PERMISSIONS.EXAM_UPDATE}><Link to={`/admin/exams/${e._id}/sections`} title="Manage Content Sections"><Button variant="ghost" size="sm"><FileText className="h-4 w-4 text-blue-500" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.EXAM_UPDATE}><Link to={`/admin/exams/${e._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard><PermissionGuard permission={PERMISSIONS.EXAM_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(e._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Exams</h1><PermissionGuard permission={PERMISSIONS.EXAM_CREATE}><Link to="/admin/exams/new"><Button><Plus className="h-4 w-4 mr-2" />Add Exam</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} /><DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteExam.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" isLoading={deleteExam.isPending} />
    </div>
  );
}
