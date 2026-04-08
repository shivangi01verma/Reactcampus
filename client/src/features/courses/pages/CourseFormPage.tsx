import { useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCourse, useCreateCourse, useUpdateCourse, useCourseColleges } from '../hooks/useCourses';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { COURSE_LEVELS, DURATION_UNITS, FEE_PER } from '@/config/constants';

export default function CourseFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id && location.pathname.endsWith('/edit');
  const isView = !!id && !location.pathname.endsWith('/edit');
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(id || '');
  const { data: colleges } = useCourseColleges(isView ? (id || '') : '');
  const createCourse = useCreateCourse(); const updateCourse = useUpdateCourse();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (course) reset({ name: course.name, level: course.level, durationValue: course.duration.value, durationUnit: course.duration.unit, stream: course.stream, specializations: course.specializations?.join(', '), feesAmount: course.fees?.amount, feesPer: course.fees?.per, description: course.description, eligibility: course.eligibility, pageFeatFaq: course.pageFeatures?.faq !== false, pageFeatDiscussion: course.pageFeatures?.discussion === true }); }, [course, reset]);
  const onSubmit = (data: any) => {
    const payload = { name: data.name, level: data.level, duration: { value: Number(data.durationValue), unit: data.durationUnit }, stream: data.stream || '', specializations: data.specializations ? data.specializations.split(',').map((s: string) => s.trim()).filter(Boolean) : [], fees: { amount: Number(data.feesAmount) || 0, per: data.feesPer || 'year' }, description: data.description || '', eligibility: data.eligibility || '', pageFeatures: { faq: !!data.pageFeatFaq, discussion: !!data.pageFeatDiscussion } };
    if (isEdit) updateCourse.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/courses') });
    else createCourse.mutate(payload, { onSuccess: () => navigate('/admin/courses') });
  };
  if ((isEdit || isView) && isLoading) return <LoadingOverlay />;
  return (
    <div className="max-w-2xl"><h1 className="text-2xl font-bold mb-6">{isView ? 'View Course' : isEdit ? 'Edit Course' : 'Create Course'}</h1>
      <Card><form onSubmit={isView ? (e) => e.preventDefault() : handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} disabled={isView} />
        <Select label="Level" options={COURSE_LEVELS.map(l => ({ label: l.charAt(0).toUpperCase() + l.slice(1), value: l }))} {...register('level')} disabled={isView} />
        <div className="grid grid-cols-2 gap-4"><Input label="Duration" type="number" {...register('durationValue')} disabled={isView} /><Select label="Unit" options={DURATION_UNITS.map(u => ({ label: u, value: u }))} {...register('durationUnit')} disabled={isView} /></div>
        <Input label="Stream" {...register('stream')} disabled={isView} /><Input label="Specializations (comma-separated)" {...register('specializations')} disabled={isView} />
        <div className="grid grid-cols-2 gap-4"><Input label="Fees" type="number" {...register('feesAmount')} disabled={isView} /><Select label="Per" options={FEE_PER.map(f => ({ label: f, value: f }))} {...register('feesPer')} disabled={isView} /></div>
        <Textarea label="Description" {...register('description')} disabled={isView} /><Textarea label="Eligibility" {...register('eligibility')} disabled={isView} />
        <div className="border-t border-gray-200 pt-4 mt-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Page Features</h3>
          <div className="flex gap-6">
            <label className={`flex items-center gap-2 ${isView ? 'pointer-events-none' : 'cursor-pointer'}`}>
              <input type="checkbox" {...register('pageFeatFaq')} disabled={isView} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Show FAQ section</span>
            </label>
            <label className={`flex items-center gap-2 ${isView ? 'pointer-events-none' : 'cursor-pointer'}`}>
              <input type="checkbox" {...register('pageFeatDiscussion')} disabled={isView} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Enable Discussion section</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          {!isView && <Button type="submit" isLoading={createCourse.isPending || updateCourse.isPending}>{isEdit ? 'Update' : 'Create'}</Button>}
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/courses')}>{isView ? 'Back to Courses' : 'Cancel'}</Button>
        </div>
      </form></Card>
      {isView && colleges && colleges.length > 0 && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Colleges Offering This Course</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">City</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ranking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {colleges.map((c: any) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">
                        <Link to={`/admin/colleges/${c._id}`} className="text-brand-600 hover:underline font-medium">{c.name}</Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{c.type || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{c.location?.city || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{c.ranking || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
      {isView && colleges && colleges.length === 0 && (
        <Card>
          <div className="p-4 text-center text-sm text-gray-500">No colleges currently offer this course.</div>
        </Card>
      )}
    </div>
  );
}
