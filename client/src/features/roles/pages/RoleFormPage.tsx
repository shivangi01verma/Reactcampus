import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useRole, useCreateRole, useUpdateRole, usePermissions, useAssignPermissions } from '../hooks/useRoles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import type { Permission } from '@/types/role';

const roleSchema = z.object({ displayName: z.string().min(1), name: z.string().min(1) });

export default function RoleFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: role, isLoading: roleLoading } = useRole(id || '');
  const { data: allPermissions } = usePermissions();
  const createRole = useCreateRole(); const updateRole = useUpdateRole(); const assignPerms = useAssignPermissions();
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(roleSchema) });

  useEffect(() => {
    if (role) {
      reset({ displayName: role.displayName, name: role.name });
      setSelectedPerms(new Set((role.permissions as Permission[]).map((p: any) => p._id || p)));
    }
  }, [role, reset]);

  const togglePerm = (permId: string) => setSelectedPerms(prev => { const next = new Set(prev); next.has(permId) ? next.delete(permId) : next.add(permId); return next; });

  const onSubmit = async (data: any) => {
    if (isEdit) {
      await updateRole.mutateAsync({ id: id!, data: { displayName: data.displayName } });
      await assignPerms.mutateAsync({ id: id!, data: { permissions: [...selectedPerms] } });
    } else {
      const newRole = await createRole.mutateAsync(data);
      if (selectedPerms.size > 0) await assignPerms.mutateAsync({ id: newRole._id, data: { permissions: [...selectedPerms] } });
    }
    navigate('/admin/roles');
  };

  if (isEdit && roleLoading) return <LoadingOverlay />;

  const grouped: Record<string, Permission[]> = {};
  if (allPermissions) for (const p of allPermissions) { if (!grouped[p.group]) grouped[p.group] = []; grouped[p.group].push(p); }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Role' : 'Create Role'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card><div className="grid grid-cols-2 gap-4"><Input label="Display Name" {...register('displayName')} error={errors.displayName?.message as string} /><Input label="Key" {...register('name')} error={errors.name?.message as string} disabled={isEdit} /></div></Card>
        <Card><CardTitle className="mb-4">Permissions</CardTitle>
          <div className="space-y-6">{Object.entries(grouped).map(([group, perms]) => (
            <div key={group}><h4 className="font-medium text-gray-700 mb-2">{group}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{perms.map(p => <label key={p._id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedPerms.has(p._id)} onChange={() => togglePerm(p._id)} className="rounded border-gray-300" />{p.description || p.key}</label>)}</div>
            </div>
          ))}</div>
        </Card>
        <div className="flex gap-3"><Button type="submit" isLoading={createRole.isPending || updateRole.isPending || assignPerms.isPending}>Save</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/roles')}>Cancel</Button></div>
      </form>
    </div>
  );
}
