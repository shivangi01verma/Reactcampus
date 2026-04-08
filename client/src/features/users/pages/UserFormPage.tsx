import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useUser, useCreateUser, useUpdateUser, useAssignRoles } from '../hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import type { Role } from '@/types/role';

const createSchema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.email(), password: z.string().min(8) });
const updateSchema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.email() });

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

export default function UserFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id || '');
  const { data: rolesData } = useRoles();
  const createUser = useCreateUser(); const updateUser = useUpdateUser(); const assignRoles = useAssignRoles();
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      setSelectedRoles(new Set((user.roles as Role[]).map((r: any) => r._id || r)));
    }
  }, [user, reset]);

  const toggleRole = (roleId: string) => setSelectedRoles(prev => { const next = new Set(prev); next.has(roleId) ? next.delete(roleId) : next.add(roleId); return next; });

  const onSubmit = async (data: any) => {
    if (isEdit) {
      await updateUser.mutateAsync({ id: id!, data });
      await assignRoles.mutateAsync({ id: id!, data: { roles: [...selectedRoles] } });
    } else {
      const newUser = await createUser.mutateAsync(data);
      if (selectedRoles.size > 0) await assignRoles.mutateAsync({ id: newUser._id, data: { roles: [...selectedRoles] } });
    }
    navigate('/admin/users');
  };

  if (isEdit && isLoading) return <LoadingOverlay />;

  const allRoles = rolesData?.data || [];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit User' : 'Create User'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card><div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><Input label="First Name" {...register('firstName')} error={errors.firstName?.message as string} /><Input label="Last Name" {...register('lastName')} error={errors.lastName?.message as string} /></div>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message as string} />
          {!isEdit && <Input label="Password" type="password" {...register('password' as any)} error={(errors as any).password?.message as string} />}
        </div></Card>
        <Card><CardTitle className="mb-4">Roles</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{allRoles.map((r: Role) => <label key={r._id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedRoles.has(r._id)} onChange={() => toggleRole(r._id)} className="rounded border-gray-300" />{r.displayName}</label>)}</div>
        </Card>
        <div className="flex gap-3"><Button type="submit" isLoading={createUser.isPending || updateUser.isPending || assignRoles.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/users')}>Cancel</Button></div>
      </form>
    </div>
  );
}
