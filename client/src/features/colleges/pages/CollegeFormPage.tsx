import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useCollege, useCreateCollege, useUpdateCollege, useManageCollegeCourses, useManageCollegeExams } from '../hooks/useColleges';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { useExams } from '@/features/exams/hooks/useExams';
import { usePublicCategories } from '@/features/categories/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { COLLEGE_TYPES } from '@/config/constants';

export default function CollegeFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id && location.pathname.endsWith('/edit');
  const isView = !!id && !location.pathname.endsWith('/edit') && !location.pathname.endsWith('/sections');
  const navigate = useNavigate();
  const { data: college, isLoading } = useCollege(id || '');
  const { data: categories = [] } = usePublicCategories();
  const createCollege = useCreateCollege(); const updateCollege = useUpdateCollege();
  const manageCourses = useManageCollegeCourses();
  const manageExams = useManageCollegeExams();
  const { data: coursesData } = useCourses({ limit: 200 });
  const allCourses = coursesData?.data || [];
  const { data: examsData } = useExams({ limit: 200 });
  const allExams = examsData?.data || [];
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [examSearch, setExamSearch] = useState('');
  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    if (college) {
      reset({ name: college.name, type: college.type, categories: (college as any).categories || [], description: college.description, logo: college.logo || '', coverImage: college.coverImage || '', city: college.location?.city, state: college.location?.state, address: college.location?.address, pincode: college.location?.pincode, feesMin: college.fees?.min, feesMax: college.fees?.max, ranking: college.ranking, established: college.established, website: college.website, accreditation: college.accreditation || '', affiliation: college.affiliation || '', facilities: college.facilities?.join(', ') || '', pageFeatFaq: college.pageFeatures?.faq !== false, pageFeatDiscussion: college.pageFeatures?.discussion === true });
      const courseIds = (college.courses || [])
        .map((c: any) => typeof c === 'string' ? c : c?._id || c?.id)
        .filter((id: any): id is string => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));
      setSelectedCourseIds(courseIds);
      const examIds = ((college as any).exams || [])
        .map((e: any) => typeof e === 'string' ? e : e?._id || e?.id)
        .filter((id: any): id is string => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));
      setSelectedExamIds(examIds);
    }
  }, [college, reset]);

  const onSubmit = (data: any) => {
    const payload = { name: data.name, type: data.type, categories: data.categories || [], description: data.description || '', logo: data.logo || '', coverImage: data.coverImage || '', location: { city: data.city || '', state: data.state || '', address: data.address || '', pincode: data.pincode || '' }, fees: { min: Number(data.feesMin) || 0, max: Number(data.feesMax) || 0 }, ranking: Number(data.ranking) || null, established: Number(data.established) || null, website: data.website || '', accreditation: data.accreditation || '', affiliation: data.affiliation || '', facilities: data.facilities ? data.facilities.split(',').map((s: string) => s.trim()).filter(Boolean) : [], pageFeatures: { faq: !!data.pageFeatFaq, discussion: !!data.pageFeatDiscussion } };
    const validCourseIds = selectedCourseIds.filter(cid => typeof cid === 'string' && /^[0-9a-fA-F]{24}$/.test(cid));
    const validExamIds = selectedExamIds.filter(eid => typeof eid === 'string' && /^[0-9a-fA-F]{24}$/.test(eid));
    const saveRelations = (collegeId: string) => {
      manageCourses.mutate({ id: collegeId, data: { courses: validCourseIds } }, {
        onSuccess: () => {
          manageExams.mutate({ id: collegeId, data: { exams: validExamIds } }, { onSuccess: () => navigate('/admin/colleges') });
        }
      });
    };
    if (isEdit) {
      updateCollege.mutate({ id: id!, data: payload }, {
        onSuccess: () => saveRelations(id!),
      });
    } else {
      createCollege.mutate(payload, {
        onSuccess: (created) => {
          const newId = (created as any)._id || (created as any).id;
          if (newId) {
            saveRelations(newId);
          } else {
            navigate('/admin/colleges');
          }
        }
      });
    }
  };
  if ((isEdit || isView) && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isView ? 'View College' : isEdit ? 'Edit College' : 'Create College'}</h1>
      <Card><form onSubmit={isView ? (e) => e.preventDefault() : handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} disabled={isView} />
        <Select label="Type" options={COLLEGE_TYPES.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))} {...register('type')} disabled={isView} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <Controller
            name="categories"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const checked = (field.value || []).includes(cat.slug);
                  return (
                    <label key={cat._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'} ${isView ? 'pointer-events-none' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value || []), cat.slug]
                            : (field.value || []).filter((v: string) => v !== cat.slug);
                          field.onChange(next);
                        }}
                        disabled={isView}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>
        <Textarea label="Description" {...register('description')} disabled={isView} />
        <div className="grid grid-cols-2 gap-4"><Input label="Logo URL" placeholder="https://..." {...register('logo')} disabled={isView} /><Input label="Cover Image URL" placeholder="https://..." {...register('coverImage')} disabled={isView} /></div>
        <div className="grid grid-cols-2 gap-4"><Input label="City" {...register('city')} disabled={isView} /><Input label="State" {...register('state')} disabled={isView} /><Input label="Address" {...register('address')} disabled={isView} /><Input label="Pincode" {...register('pincode')} disabled={isView} /></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Min Fees" type="number" {...register('feesMin')} disabled={isView} /><Input label="Max Fees" type="number" {...register('feesMax')} disabled={isView} /></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Ranking" type="number" {...register('ranking')} disabled={isView} /><Input label="Established" type="number" {...register('established')} disabled={isView} /></div>
        <Input label="Website" {...register('website')} disabled={isView} />
        <div className="grid grid-cols-2 gap-4"><Input label="Accreditation" placeholder="e.g. NAAC A++ / NBA" {...register('accreditation')} disabled={isView} /><Input label="Affiliation" placeholder="e.g. VTU, Autonomous" {...register('affiliation')} disabled={isView} /></div>
        <Input label="Facilities (comma-separated)" placeholder="Library, Hostel, Sports Complex, WiFi Campus" {...register('facilities')} disabled={isView} />
        <div className="border-t border-gray-200 pt-4 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Courses Offered</label>
          <input
            type="text"
            placeholder="Search courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            disabled={isView}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-50"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {allCourses
              .filter((c) => c.name.toLowerCase().includes(courseSearch.toLowerCase()))
              .map((course) => {
                const checked = selectedCourseIds.includes(course._id);
                return (
                  <label key={course._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'} ${isView ? 'pointer-events-none' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedCourseIds(prev =>
                          e.target.checked ? [...prev, course._id] : prev.filter(id => id !== course._id)
                        );
                      }}
                      disabled={isView}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">{course.name} <span className="text-gray-400 capitalize">— {course.level}</span></span>
                  </label>
                );
              })}
            {allCourses.length === 0 && <p className="text-sm text-gray-400 col-span-2">No courses available</p>}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Exams Accepted</label>
          <input
            type="text"
            placeholder="Search exams..."
            value={examSearch}
            onChange={(e) => setExamSearch(e.target.value)}
            disabled={isView}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-50"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {allExams
              .filter((e) => e.name.toLowerCase().includes(examSearch.toLowerCase()))
              .map((exam) => {
                const checked = selectedExamIds.includes(exam._id);
                return (
                  <label key={exam._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'} ${isView ? 'pointer-events-none' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedExamIds(prev =>
                          e.target.checked ? [...prev, exam._id] : prev.filter(id => id !== exam._id)
                        );
                      }}
                      disabled={isView}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">{exam.name} <span className="text-gray-400 capitalize">— {exam.examType}</span></span>
                  </label>
                );
              })}
            {allExams.length === 0 && <p className="text-sm text-gray-400 col-span-2">No exams available</p>}
          </div>
        </div>
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
          {!isView && <Button type="submit" isLoading={createCollege.isPending || updateCollege.isPending || manageCourses.isPending || manageExams.isPending}>{isEdit ? 'Update' : 'Create'}</Button>}
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/colleges')}>{isView ? 'Back to Colleges' : 'Cancel'}</Button>
        </div>
      </form></Card>
    </div>
  );
}
