import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/services/authApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const schema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8), confirmPassword: z.string() }).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

export default function ChangePasswordPage() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: (data: any) => authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }), onSuccess: () => { toast.success('Password changed'); reset(); }, onError: (err: any) => toast.error(err.response?.data?.message || 'Failed') });
  return (
    <div className="max-w-lg"><h1 className="text-2xl font-bold mb-6">Change Password</h1><Card><form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4"><Input label="Current Password" type="password" {...register('currentPassword')} error={errors.currentPassword?.message as string} /><Input label="New Password" type="password" {...register('newPassword')} error={errors.newPassword?.message as string} /><Input label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message as string} /><Button type="submit" isLoading={mutation.isPending}>Change Password</Button></form></Card></div>
  );
}
