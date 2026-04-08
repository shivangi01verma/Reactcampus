import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/services/authApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { queryKeys } from '@/config/queryKeys';

export default function ProfilePage() {
  const { user } = useAuth(); const toast = useToast(); const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (user) reset({ firstName: user.firstName, lastName: user.lastName }); }, [user, reset]);
  const mutation = useMutation({ mutationFn: (data: any) => authApi.updateProfile(data), onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.auth.me }); toast.success('Profile updated'); }, onError: () => toast.error('Failed') });
  return (
    <div className="max-w-lg"><h1 className="text-2xl font-bold mb-6">Profile</h1><Card><form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4"><Input label="First Name" {...register('firstName')} /><Input label="Last Name" {...register('lastName')} /><Input label="Email" value={user?.email || ''} disabled /><Button type="submit" isLoading={mutation.isPending}>Save</Button></form></Card></div>
  );
}
