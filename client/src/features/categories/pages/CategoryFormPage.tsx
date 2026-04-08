import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCategory, useCreateCategory, useUpdateCategory } from '../hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

export default function CategoryFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id && location.pathname.endsWith('/edit');
  const isView = !!id && !location.pathname.endsWith('/edit');
  const navigate = useNavigate();
  const { data: category, isLoading } = useCategory(id || '');
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon || '',
        order: category.order,
        isActive: category.isActive,
      });
    }
  }, [category, reset]);

  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      icon: data.icon || '',
      order: Number(data.order) || 0,
      isActive: data.isActive === true || data.isActive === 'true',
    };
    if (isEdit) {
      updateCategory.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/categories') });
    } else {
      createCategory.mutate(payload, { onSuccess: () => navigate('/admin/categories') });
    }
  };

  if ((isEdit || isView) && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">{isView ? 'View Category' : isEdit ? 'Edit Category' : 'Create Category'}</h1>
      <Card>
        <form onSubmit={isView ? (e) => e.preventDefault() : handleSubmit(onSubmit)} className="space-y-4 p-6">
          <Input label="Name" {...register('name', { required: true })} disabled={isView} />
          <Input label="Icon" placeholder="e.g. Wrench, Heart, Briefcase" {...register('icon')} disabled={isView} />
          <Input label="Order" type="number" {...register('order')} disabled={isView} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} disabled={isView} className="rounded border-gray-300" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3">
            {!isView && <Button type="submit" isLoading={createCategory.isPending || updateCategory.isPending}>{isEdit ? 'Update' : 'Create'}</Button>}
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/categories')}>{isView ? 'Back' : 'Cancel'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
