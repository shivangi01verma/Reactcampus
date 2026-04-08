import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead, useChangeLeadStatus, useAddLeadNote, useUpdateLead, useAssignLead } from '../hooks/useLeads';
import { useUsers } from '@/features/users/hooks/useUsers';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { LEAD_STATUSES, LEAD_PRIORITIES, LEAD_STATUS_COLORS, PRIORITY_COLORS } from '@/config/constants';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { ArrowLeft, Clock, Pencil, Check, X, MessageSquare, Tag, Plus } from 'lucide-react';

function formatRelativeDate(dateStr: string) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id || '');
  const { data: usersData } = useUsers({ limit: 100 });
  const changeStatus = useChangeLeadStatus();
  const addNote = useAddLeadNote();
  const updateLead = useUpdateLead();
  const assignLead = useAssignLead();

  const users = usersData?.data || [];

  const [noteContent, setNoteContent] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTag, setNewTag] = useState('');

  // Unified timeline: merge statusHistory + notes, sorted desc
  const timeline = useMemo(() => {
    if (!lead) return [];
    const items: Array<{ type: 'status' | 'note'; date: string; data: any }> = [];
    lead.statusHistory.forEach((e: any) => {
      items.push({ type: 'status', date: e.changedAt, data: e });
    });
    lead.notes.forEach((n: any) => {
      items.push({ type: 'note', date: n.createdAt, data: n });
    });
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [lead]);

  if (isLoading || !lead) return <LoadingOverlay />;

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = (field: string) => {
    if (editValue.trim() !== '') {
      updateLead.mutate({ id: id!, data: { [field]: editValue } });
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleStatusChange = (newStatus: string) => {
    changeStatus.mutate({ id: id!, data: { status: newStatus as any } });
  };

  const handlePriorityChange = (newPriority: string) => {
    updateLead.mutate({ id: id!, data: { priority: newPriority as any } });
  };

  const handleAssign = (userId: string) => {
    if (userId) {
      assignLead.mutate({ id: id!, data: { assignedTo: userId } });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = lead.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        updateLead.mutate({ id: id!, data: { tags: [...currentTags, newTag.trim()] } });
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = (lead.tags || []).filter((t: string) => t !== tag);
    updateLead.mutate({ id: id!, data: { tags: updated } });
  };

  const assignedUser = lead.assignedTo && typeof lead.assignedTo === 'object' ? lead.assignedTo : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/leads')}>
        <ArrowLeft className="h-4 w-4 mr-2" />Back to Leads
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header with inline edit */}
          <Card>
            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center gap-2">
                {editingField === 'name' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="text-2xl font-bold border-b-2 border-blue-500 outline-none flex-1 bg-transparent"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit('name'); if (e.key === 'Escape') cancelEdit(); }}
                    />
                    <button onClick={() => saveEdit('name')} className="text-green-600 hover:text-green-700"><Check className="h-5 w-5" /></button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{lead.name}</h1>
                    <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
                      <button onClick={() => startEdit('name', lead.name)} className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </PermissionGuard>
                  </>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                {editingField === 'email' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="email"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="text-sm border-b-2 border-blue-500 outline-none flex-1 bg-transparent"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit('email'); if (e.key === 'Escape') cancelEdit(); }}
                    />
                    <button onClick={() => saveEdit('email')} className="text-green-600"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-gray-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">{lead.email || 'No email'}</span>
                    <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
                      <button onClick={() => startEdit('email', lead.email || '')} className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-3 w-3" />
                      </button>
                    </PermissionGuard>
                  </>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                {editingField === 'phone' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="text-sm border-b-2 border-blue-500 outline-none flex-1 bg-transparent"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit('phone'); if (e.key === 'Escape') cancelEdit(); }}
                    />
                    <button onClick={() => saveEdit('phone')} className="text-green-600"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="text-gray-400"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">{lead.phone || 'No phone'}</span>
                    <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
                      <button onClick={() => startEdit('phone', lead.phone || '')} className="text-gray-400 hover:text-gray-600">
                        <Pencil className="h-3 w-3" />
                      </button>
                    </PermissionGuard>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Info Card */}
          <Card>
            <CardTitle className="mb-4">Contact Information</CardTitle>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">College:</span> <span className="ml-1">{(lead as any).college?.name || '-'}</span></div>
              <div><span className="text-gray-500">Course:</span> <span className="ml-1">{(lead as any).course?.name || '-'}</span></div>
              <div><span className="text-gray-500">Source:</span> <span className="ml-1">{(lead as any).source?.form?.title || lead.source?.channel || '-'}</span></div>
              <div><span className="text-gray-500">Created:</span> <span className="ml-1">{new Date(lead.createdAt).toLocaleDateString()}</span></div>
            </div>
          </Card>

          {/* Form Data Card (if any) */}
          {lead.data && Object.keys(lead.data).length > 0 && (
            <Card>
              <CardTitle className="mb-4">Form Data</CardTitle>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(lead.data).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</span>
                    <span className="ml-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes Section */}
          <Card>
            <CardTitle className="mb-4">Notes</CardTitle>
            <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
              <div className="flex gap-2 mb-4">
                <Textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Write a note..."
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    if (noteContent.trim()) {
                      addNote.mutate({ id: id!, data: { content: noteContent } }, {
                        onSuccess: () => setNoteContent('')
                      });
                    }
                  }}
                  isLoading={addNote.isPending}
                  className="self-end"
                >
                  Add
                </Button>
              </div>
            </PermissionGuard>
            <div className="space-y-3">
              {[...lead.notes].reverse().map((note: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p>{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.createdBy && typeof note.createdBy === 'object'
                      ? `${note.createdBy.firstName} ${note.createdBy.lastName}`
                      : 'System'}
                    {' '}&middot; {formatRelativeDate(note.createdAt)}
                  </p>
                </div>
              ))}
              {lead.notes.length === 0 && <p className="text-sm text-gray-400">No notes yet.</p>}
            </div>
          </Card>
        </div>

        {/* Right Column — 1/3 */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardTitle className="mb-4">Quick Actions</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <Select
                  options={LEAD_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
                  value={lead.status}
                  onChange={e => handleStatusChange(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Priority</label>
                <Select
                  options={LEAD_PRIORITIES.map(p => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p }))}
                  value={lead.priority}
                  onChange={e => handlePriorityChange(e.target.value)}
                />
              </div>
              <PermissionGuard permission={PERMISSIONS.LEAD_ASSIGN}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Assigned To</label>
                  <Select
                    options={[{ label: 'Unassigned', value: '' }, ...users.map((u: any) => ({ label: `${u.firstName} ${u.lastName}`, value: u._id }))]}
                    value={assignedUser ? (assignedUser as any)._id || '' : ''}
                    onChange={e => handleAssign(e.target.value)}
                  />
                  {assignedUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Currently: {(assignedUser as any).firstName} {(assignedUser as any).lastName}
                    </p>
                  )}
                </div>
              </PermissionGuard>
            </div>
          </Card>

          {/* Tags Card */}
          <Card>
            <CardTitle className="mb-3">Tags</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {(lead.tags || []).map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
                    <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </PermissionGuard>
                </span>
              ))}
              {(lead.tags || []).length === 0 && <p className="text-xs text-gray-400">No tags</p>}
            </div>
            <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
                />
                <Button size="sm" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </PermissionGuard>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardTitle className="mb-4">Activity Timeline</CardTitle>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  {item.type === 'status' ? (
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {item.type === 'status' ? (
                      <>
                        <p>
                          <StatusBadge status={item.data.from} colorMap={LEAD_STATUS_COLORS} />
                          <span className="mx-1">&rarr;</span>
                          <StatusBadge status={item.data.to} colorMap={LEAD_STATUS_COLORS} />
                        </p>
                        {item.data.note && <p className="text-gray-500 mt-1">{item.data.note}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {item.data.changedBy && typeof item.data.changedBy === 'object'
                            ? `${item.data.changedBy.firstName} ${item.data.changedBy.lastName}`
                            : ''}
                          {' '}&middot; {formatRelativeDate(item.data.changedAt)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700">{item.data.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.data.createdBy && typeof item.data.createdBy === 'object'
                            ? `${item.data.createdBy.firstName} ${item.data.createdBy.lastName}`
                            : ''}
                          {' '}&middot; {formatRelativeDate(item.data.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {timeline.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
