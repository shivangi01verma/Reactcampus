import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSeo, useCreateSeo, useUpdateSeo } from '../hooks/useSeo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { SEO_TARGET_TYPES } from '@/config/constants';

export default function SeoFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: seo, isLoading } = useSeo(id || ''); const createSeo = useCreateSeo(); const updateSeo = useUpdateSeo();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (seo) reset({ targetType: seo.targetType, targetId: seo.targetId, metaTitle: seo.metaTitle, metaDescription: seo.metaDescription, metaKeywords: seo.metaKeywords?.join(', '), canonicalUrl: seo.canonicalUrl, ogTitle: seo.ogTitle, ogDescription: seo.ogDescription, ogImage: seo.ogImage, robots: seo.robots, structuredData: seo.structuredData ? JSON.stringify(seo.structuredData, null, 2) : '' }); }, [seo, reset]);
  const onSubmit = (data: any) => {
    const payload = { ...data, metaKeywords: data.metaKeywords ? data.metaKeywords.split(',').map((k: string) => k.trim()) : [], structuredData: data.structuredData ? JSON.parse(data.structuredData) : null };
    if (isEdit) updateSeo.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/seo') });
    else createSeo.mutate(payload, { onSuccess: () => navigate('/admin/seo') });
  };
  if (isEdit && isLoading) return <LoadingOverlay />;
  return (
    <div className="max-w-3xl"><h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit SEO' : 'Create SEO'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card><CardTitle className="mb-4">Target</CardTitle><div className="grid grid-cols-2 gap-4"><Select label="Type" options={SEO_TARGET_TYPES.map(t => ({ label: t, value: t }))} {...register('targetType')} /><Input label="Target ID" {...register('targetId')} /></div></Card>
        <Card><CardTitle className="mb-4">Meta</CardTitle><div className="space-y-4"><Input label="Meta Title" {...register('metaTitle')} /><Textarea label="Meta Description" {...register('metaDescription')} /><Input label="Keywords (comma-separated)" {...register('metaKeywords')} /><Input label="Canonical URL" {...register('canonicalUrl')} /><Input label="Robots" {...register('robots')} /></div></Card>
        <Card><CardTitle className="mb-4">Open Graph</CardTitle><div className="space-y-4"><Input label="OG Title" {...register('ogTitle')} /><Textarea label="OG Description" {...register('ogDescription')} /><Input label="OG Image" {...register('ogImage')} /></div></Card>
        <Card><CardTitle className="mb-4">Structured Data</CardTitle><Textarea label="JSON-LD" {...register('structuredData')} rows={8} /></Card>
        <div className="flex gap-3"><Button type="submit" isLoading={createSeo.isPending || updateSeo.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/seo')}>Cancel</Button></div>
      </form></div>
  );
}
