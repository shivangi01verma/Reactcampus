import { useState } from 'react';
import { useSubmissions } from '../hooks/useForms';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';
import type { FormSubmission } from '@/types/form';

export default function SubmissionListPage() {
  const [page, setPage] = useState(1); const [detail, setDetail] = useState<FormSubmission | null>(null);
  const { data, isLoading } = useSubmissions({ page, limit: 20 });
  const columns: Column<FormSubmission>[] = [
    { key: 'form', header: 'Form', render: (s) => s.form && typeof s.form === 'object' ? (s.form as any).title : (s.form || 'Deleted Form') },
    { key: 'createdAt', header: 'Submitted', render: (s) => new Date(s.createdAt).toLocaleString() },
    { key: 'actions', header: '', render: (s) => <Button variant="ghost" size="sm" onClick={() => setDetail(s)}><Eye className="h-4 w-4" /></Button> },
  ];
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Submissions</h1>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Submission Detail" size="lg">{detail && <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto max-h-96">{JSON.stringify(detail.data, null, 2)}</pre>}</Modal>
    </div>
  );
}
