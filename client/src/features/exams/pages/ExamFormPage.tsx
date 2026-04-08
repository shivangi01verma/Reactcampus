import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useExam, useCreateExam, useUpdateExam } from '../hooks/useExams';
import { usePublicCategories } from '@/features/categories/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { EXAM_TYPES, EXAM_MODES } from '@/config/constants';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateExamRequest } from '@/types/exam';

export default function ExamFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id && location.pathname.endsWith('/edit');
  const isView = !!id && !location.pathname.endsWith('/edit') && !location.pathname.endsWith('/sections');
  const navigate = useNavigate();
  const { data: exam, isLoading } = useExam(id || '');
  const { data: categories = [] } = usePublicCategories();
  const createExam = useCreateExam(); const updateExam = useUpdateExam();
  const { register, handleSubmit, control, reset } = useForm<CreateExamRequest & { pageFeatFaq?: boolean; pageFeatDiscussion?: boolean }>({
    defaultValues: {
      name: '', examType: 'national', conductedBy: '', description: '', eligibility: '', website: '',
      pattern: { mode: 'online', duration: '', totalMarks: 0, sections: [] },
      importantDates: [],
      pageFeatFaq: true, pageFeatDiscussion: false,
    },
  });
  const { fields: sections, append: addSection, remove: removeSection } = useFieldArray({ control, name: 'pattern.sections' as any });
  const { fields: dates, append: addDate, remove: removeDate } = useFieldArray({ control, name: 'importantDates' as any });
  useEffect(() => { if (exam) reset({ name: exam.name, examType: exam.examType, categories: exam.categories || [], conductedBy: exam.conductedBy, description: exam.description, eligibility: exam.eligibility, website: exam.website, pattern: { mode: exam.pattern?.mode || 'online', duration: exam.pattern?.duration || '', totalMarks: exam.pattern?.totalMarks || 0, sections: exam.pattern?.sections || [] }, importantDates: exam.importantDates?.map(d => ({ ...d, date: d.date ? new Date(d.date).toISOString().split('T')[0] : '' })) || [], pageFeatFaq: exam.pageFeatures?.faq !== false, pageFeatDiscussion: exam.pageFeatures?.discussion === true }); }, [exam, reset]);
  const onSubmit = (data: any) => { const { pageFeatFaq, pageFeatDiscussion, ...rest } = data; const payload = { ...rest, pageFeatures: { faq: !!pageFeatFaq, discussion: !!pageFeatDiscussion } }; if (isEdit) updateExam.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/exams') }); else createExam.mutate(payload, { onSuccess: () => navigate('/admin/exams') }); };
  if ((isEdit || isView) && isLoading) return <LoadingOverlay />;
  return (
    <div className="max-w-3xl"><h1 className="text-2xl font-bold mb-6">{isView ? 'View Exam' : isEdit ? 'Edit Exam' : 'Create Exam'}</h1>
      <form onSubmit={isView ? (e) => e.preventDefault() : handleSubmit(onSubmit)} className="space-y-6">
        <Card><div className="space-y-4"><Input label="Name" {...register('name')} disabled={isView} /><Select label="Type" options={EXAM_TYPES.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))} {...register('examType')} disabled={isView} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <Controller name="categories" control={control} defaultValue={[]} render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const checked = (field.value || []).includes(cat.slug);
                  return (
                    <label key={cat._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'} ${isView ? 'pointer-events-none' : ''}`}>
                      <input type="checkbox" checked={checked} onChange={(e) => { const next = e.target.checked ? [...(field.value || []), cat.slug] : (field.value || []).filter((v: string) => v !== cat.slug); field.onChange(next); }} disabled={isView} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-gray-700 capitalize">{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            )} />
          </div>
          <Input label="Conducted By" {...register('conductedBy')} disabled={isView} /><Textarea label="Description" {...register('description')} disabled={isView} /><Textarea label="Eligibility" {...register('eligibility')} disabled={isView} /><Input label="Website" {...register('website')} disabled={isView} /></div></Card>
        <Card><CardTitle className="mb-4">Pattern</CardTitle><div className="space-y-4"><Select label="Mode" options={EXAM_MODES.map(m => ({ label: m, value: m }))} {...register('pattern.mode')} disabled={isView} /><div className="grid grid-cols-2 gap-4"><Input label="Duration" {...register('pattern.duration')} disabled={isView} /><Input label="Total Marks" type="number" {...register('pattern.totalMarks', { valueAsNumber: true })} disabled={isView} /></div><div><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-medium">Sections</h4>{!isView && <Button type="button" variant="ghost" size="sm" onClick={() => addSection({ name: '', questions: 0, marks: 0 })}><Plus className="h-4 w-4 mr-1" />Add</Button>}</div>{sections.map((s, i) => <div key={s.id} className="flex gap-2 items-end"><Input label="Name" {...register(`pattern.sections.${i}.name` as any)} disabled={isView} /><Input label="Q" type="number" {...register(`pattern.sections.${i}.questions` as any, { valueAsNumber: true })} disabled={isView} /><Input label="Marks" type="number" {...register(`pattern.sections.${i}.marks` as any, { valueAsNumber: true })} disabled={isView} />{!isView && <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}</div>)}</div></div></Card>
        <Card><CardTitle className="mb-4">Important Dates</CardTitle>{!isView && <Button type="button" variant="ghost" size="sm" onClick={() => addDate({ event: '', date: '', description: '' })}><Plus className="h-4 w-4 mr-1" />Add Date</Button>}{dates.map((d, i) => <div key={d.id} className="flex gap-2 items-end mt-2"><Input label="Event" {...register(`importantDates.${i}.event` as any)} disabled={isView} /><Input label="Date" type="date" {...register(`importantDates.${i}.date` as any)} disabled={isView} /><Input label="Desc" {...register(`importantDates.${i}.description` as any)} disabled={isView} />{!isView && <Button type="button" variant="ghost" size="sm" onClick={() => removeDate(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}</div>)}</Card>
        <Card><CardTitle className="mb-4">Page Features</CardTitle><div className="flex gap-6">
            <label className={`flex items-center gap-2 ${isView ? 'pointer-events-none' : 'cursor-pointer'}`}>
              <input type="checkbox" {...register('pageFeatFaq')} disabled={isView} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Show FAQ section</span>
            </label>
            <label className={`flex items-center gap-2 ${isView ? 'pointer-events-none' : 'cursor-pointer'}`}>
              <input type="checkbox" {...register('pageFeatDiscussion')} disabled={isView} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Enable Discussion section</span>
            </label>
          </div></Card>
        <div className="flex gap-3">
          {!isView && <Button type="submit" isLoading={createExam.isPending || updateExam.isPending}>{isEdit ? 'Update' : 'Create'}</Button>}
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/exams')}>{isView ? 'Back to Exams' : 'Cancel'}</Button>
        </div>
      </form></div>
  );
}
