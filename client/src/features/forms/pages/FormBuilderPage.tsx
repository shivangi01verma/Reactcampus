import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm as useFormHook, useCreateForm, useUpdateForm } from '../hooks/useForms';
import { useColleges } from '@/features/colleges/hooks/useColleges';
import { useExams } from '@/features/exams/hooks/useExams';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FORM_FIELD_TYPES, FORM_PURPOSES, LEAD_FIELD_MAPPINGS, POST_SUBMIT_ACTIONS } from '@/config/constants';
import { Plus, Trash2, GripVertical, Settings, List, Monitor, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { FormField, PageAssignment } from '@/types/form';

type Tab = 'settings' | 'fields' | 'pages';
type AssignmentDraft = Partial<PageAssignment> & { _entityName?: string };

const PAGE_TYPES = [
  { value: 'all_colleges', label: 'All College Pages' },
  { value: 'college', label: 'Specific College Page' },
  { value: 'all_exams', label: 'All Exam Pages' },
  { value: 'exam', label: 'Specific Exam Page' },
  { value: 'all_courses', label: 'All Course Pages' },
  { value: 'course', label: 'Specific Course Page' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'page', label: 'Specific Dynamic Page' },
];

const TRIGGER_OPTIONS = [
  { value: 'immediate', label: 'Immediately on page load' },
  { value: 'delay', label: 'After a delay' },
  { value: 'scroll', label: 'After scrolling down' },
  { value: 'exit_intent', label: 'On exit intent' },
];

const DISPLAY_OPTIONS = [
  { value: 'popup', label: 'Popup / Modal' },
  { value: 'inline', label: 'Inline (embedded in page)' },
  { value: 'slide_in', label: 'Slide-in panel' },
];

function defaultAssignment(): AssignmentDraft {
  return {
    pageType: 'all_colleges',
    entityId: null,
    displayAs: 'popup',
    trigger: 'delay',
    delaySeconds: 5,
    scrollPercent: 50,
    showOnce: true,
    _entityName: '',
  };
}

// --- Entity search pickers ---

function CollegePicker({ value, entityName, onSelect }: { value: string | null; entityName: string; onSelect: (id: string, name: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data } = useColleges({ search, limit: 8 });
  const colleges = data?.data || [];
  return (
    <div className="relative">
      <Input
        label="College"
        placeholder="Search college..."
        value={open ? search : (entityName || '')}
        onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {value && !open && (
        <button type="button" className="absolute right-2 top-8 text-gray-400 hover:text-gray-600" onClick={() => { onSelect('', ''); setSearch(''); }}>
          <X className="h-4 w-4" />
        </button>
      )}
      {open && colleges.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {colleges.map((c: any) => (
            <button key={c._id} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700"
              onMouseDown={() => { onSelect(c._id, c.name); setSearch(''); setOpen(false); }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExamPicker({ value, entityName, onSelect }: { value: string | null; entityName: string; onSelect: (id: string, name: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data } = useExams({ search, limit: 8 });
  const exams = data?.data || [];
  return (
    <div className="relative">
      <Input
        label="Exam"
        placeholder="Search exam..."
        value={open ? search : (entityName || '')}
        onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {value && !open && (
        <button type="button" className="absolute right-2 top-8 text-gray-400 hover:text-gray-600" onClick={() => { onSelect('', ''); setSearch(''); }}>
          <X className="h-4 w-4" />
        </button>
      )}
      {open && exams.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {exams.map((e: any) => (
            <button key={e._id} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700"
              onMouseDown={() => { onSelect(e._id, e.name); setSearch(''); setOpen(false); }}>
              {e.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CoursePicker({ value, entityName, onSelect }: { value: string | null; entityName: string; onSelect: (id: string, name: string) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data } = useCourses({ search, limit: 8 });
  const courses = data?.data || [];
  return (
    <div className="relative">
      <Input
        label="Course"
        placeholder="Search course..."
        value={open ? search : (entityName || '')}
        onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {value && !open && (
        <button type="button" className="absolute right-2 top-8 text-gray-400 hover:text-gray-600" onClick={() => { onSelect('', ''); setSearch(''); }}>
          <X className="h-4 w-4" />
        </button>
      )}
      {open && courses.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {courses.map((c: any) => (
            <button key={c._id} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700"
              onMouseDown={() => { onSelect(c._id, c.name); setSearch(''); setOpen(false); }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Assignment row display ---
function assignmentSummary(a: AssignmentDraft): string {
  const type = PAGE_TYPES.find(p => p.value === a.pageType)?.label || a.pageType || '';
  const entity = a._entityName ? ` → ${a._entityName}` : '';
  const trigger = a.trigger === 'delay' ? ` · ${a.delaySeconds}s delay`
    : a.trigger === 'scroll' ? ` · ${a.scrollPercent}% scroll`
    : a.trigger === 'exit_intent' ? ' · exit intent'
    : ' · immediate';
  const display = a.displayAs === 'slide_in' ? 'Slide-in' : a.displayAs === 'inline' ? 'Inline' : 'Popup';
  return `${type}${entity} — ${display}${trigger}${a.showOnce ? ' · once' : ''}`;
}

// --- Main component ---
export default function FormBuilderPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data: form, isLoading } = useFormHook(id || '');
  const createForm = useCreateForm();
  const updateForm = useUpdateForm();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('settings');

  // Settings
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<string>('generic');
  const [postSubmitAction, setPostSubmitAction] = useState<string>('message');
  const [successMessage, setSuccessMessage] = useState('Thank you for your submission!');
  const [redirectUrl, setRedirectUrl] = useState('');

  // Fields
  const [fields, setFields] = useState<Partial<FormField>[]>([]);
  const [expandedField, setExpandedField] = useState<number | null>(null);

  // Pages
  const [assignedPages, setAssignedPages] = useState<AssignmentDraft[]>([]);
  const [addingPage, setAddingPage] = useState(false);
  const [newPage, setNewPage] = useState<AssignmentDraft>(defaultAssignment());

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description);
      setPurpose(form.purpose);
      setPostSubmitAction(form.postSubmitAction);
      setSuccessMessage(form.successMessage);
      setRedirectUrl(form.redirectUrl || '');
      setFields(form.fields || []);
      setAssignedPages(
        (form.assignedPages || []).map(p => ({
          ...p,
          _entityName: '',
        }))
      );
    }
  }, [form]);

  // Field helpers
  const addField = () => {
    const newField: Partial<FormField> = {
      fieldId: crypto.randomUUID(),
      type: 'text',
      label: '',
      name: '',
      placeholder: '',
      validation: { required: false, minLength: null, maxLength: null, min: null, max: null, pattern: null, customMessage: '' },
      options: [],
      order: fields.length,
      conditionalOn: { fieldName: null, value: null },
      leadFieldMapping: null,
    };
    setFields([...fields, newField]);
    setExpandedField(fields.length);
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
    if (expandedField === idx) setExpandedField(null);
  };

  const updateField = (idx: number, updates: Partial<FormField>) =>
    setFields(fields.map((f, i) => (i === idx ? { ...f, ...updates } : f)));

  const hasOptions = (type: string) => ['dropdown', 'radio', 'checkbox'].includes(type);

  // Page assignment helpers
  const removeAssignment = (idx: number) =>
    setAssignedPages(assignedPages.filter((_, i) => i !== idx));

  const addAssignment = () => {
    if (!newPage.pageType) return;
    setAssignedPages([...assignedPages, { ...newPage }]);
    setNewPage(defaultAssignment());
    setAddingPage(false);
  };

  // Save
  const handleSave = () => {
    // Validate title
    if (!title.trim()) {
      toast.error('Form title is required');
      setTab('settings');
      return;
    }

    // Validate fields
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label?.trim()) {
        toast.error(`Field ${i + 1} is missing a label`);
        setTab('fields');
        setExpandedField(i);
        return;
      }
      if (!f.name?.trim()) {
        toast.error(`Field "${f.label}" is missing a field name`);
        setTab('fields');
        setExpandedField(i);
        return;
      }
    }

    // Clean fields before sending
    const cleanedFields = fields.map(({ fieldId, conditionalOn, ...rest }) => ({
      ...rest,
      // Only include conditionalOn if fieldName is actually set
      ...(conditionalOn?.fieldName ? { conditionalOn } : {}),
    }));

    const pages = assignedPages.map(({ _entityName, ...rest }) => ({
      ...rest,
      entityId: rest.entityId || null,
    }));

    const payload = {
      title,
      description,
      purpose: purpose as any,
      postSubmitAction: postSubmitAction as any,
      successMessage,
      redirectUrl,
      fields: cleanedFields as any,
      assignedPages: pages as any,
    };
    if (isEdit) {
      updateForm.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/forms') });
    } else {
      createForm.mutate(payload, { onSuccess: () => navigate('/admin/forms') });
    }
  };

  if (isEdit && isLoading) return <LoadingOverlay />;

  const tabs = [
    { key: 'settings' as Tab, label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { key: 'fields' as Tab, label: `Fields (${fields.length})`, icon: <List className="h-4 w-4" /> },
    { key: 'pages' as Tab, label: `Pages & Display (${assignedPages.length})`, icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Form' : 'Create Form'}</h1>
        <div className="flex gap-3">
          <Button onClick={handleSave} isLoading={createForm.isPending || updateForm.isPending}>Save</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/forms')}>Cancel</Button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-gray-200 flex gap-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* === SETTINGS TAB === */}
      {tab === 'settings' && (
        <Card>
          <div className="space-y-4">
            <Input label="Form Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Admissions Enquiry" />
            <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this form" />
            <Select label="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)}
              options={FORM_PURPOSES.map(p => ({ label: p.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: p }))} />
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">
              {purpose === 'lead_capture' && '📋 Submissions will be saved as Leads. Map fields to lead properties in the Fields tab.'}
              {purpose === 'review' && '⭐ Submissions will be saved as College Reviews.'}
              {purpose === 'generic' && '📝 Submissions are saved as form submissions only.'}
            </div>
            <Select label="After Submission" value={postSubmitAction} onChange={e => setPostSubmitAction(e.target.value)}
              options={POST_SUBMIT_ACTIONS.map(a => ({ label: a.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: a }))} />
            {(postSubmitAction === 'message' || postSubmitAction === 'both') && (
              <Textarea label="Success Message" value={successMessage} onChange={e => setSuccessMessage(e.target.value)} />
            )}
            {(postSubmitAction === 'redirect' || postSubmitAction === 'both') && (
              <Input label="Redirect URL" value={redirectUrl} onChange={e => setRedirectUrl(e.target.value)} placeholder="https://..." />
            )}
          </div>
        </Card>
      )}

      {/* === FIELDS TAB === */}
      {tab === 'fields' && (
        <div className="space-y-4">
          {fields.length === 0 && (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
              No fields yet. Click "Add Field" to start building.
            </div>
          )}
          {fields.map((field, idx) => {
            const expanded = expandedField === idx;
            return (
              <Card key={field.fieldId || idx}>
                {/* Field header row */}
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate">
                      {field.label || `Field ${idx + 1}`}
                      <span className="ml-2 text-xs text-gray-400 font-normal">{field.type}</span>
                      {field.validation?.required && <span className="ml-1 text-xs text-red-500">*</span>}
                      {field.leadFieldMapping && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">→ {field.leadFieldMapping}</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => setExpandedField(expanded ? null : idx)} className="text-gray-400 hover:text-gray-600">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => removeField(idx)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>

                {/* Expanded field editor */}
                {expanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Select label="Type" value={field.type || 'text'} onChange={e => updateField(idx, { type: e.target.value as any })}
                        options={FORM_FIELD_TYPES.map(t => ({ label: t, value: t }))} />
                      <Input label="Label" value={field.label || ''} onChange={e => updateField(idx, { label: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Field Name (key)" value={field.name || ''} onChange={e => updateField(idx, { name: e.target.value })} placeholder="e.g. student_name" />
                      <Input label="Placeholder" value={field.placeholder || ''} onChange={e => updateField(idx, { placeholder: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={field.validation?.required || false}
                          onChange={e => updateField(idx, { validation: { ...field.validation!, required: e.target.checked } })} />
                        <span>Required field</span>
                      </label>
                    </div>

                    {/* Lead field mapping - only shown for lead_capture forms */}
                    {purpose === 'lead_capture' && (
                      <Select label="Maps to Lead Field"
                        value={field.leadFieldMapping || ''}
                        onChange={e => updateField(idx, { leadFieldMapping: e.target.value || null })}
                        options={[
                          { label: '— None (save in extra data) —', value: '' },
                          ...LEAD_FIELD_MAPPINGS.filter(Boolean).map(m => ({ label: m as string, value: m as string })),
                        ]}
                      />
                    )}

                    {/* Options for dropdown / radio / checkbox */}
                    {hasOptions(field.type || '') && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Options</span>
                          <Button variant="outline" size="sm" onClick={() => updateField(idx, { options: [...(field.options || []), { label: '', value: '' }] })}>
                            <Plus className="h-3 w-3 mr-1" />Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(field.options || []).map((opt, oi) => (
                            <div key={oi} className="flex gap-2 items-center">
                              <Input placeholder="Label" value={opt.label} onChange={e => {
                                const opts = [...(field.options || [])];
                                opts[oi] = { ...opts[oi], label: e.target.value };
                                updateField(idx, { options: opts });
                              }} />
                              <Input placeholder="Value" value={opt.value} onChange={e => {
                                const opts = [...(field.options || [])];
                                opts[oi] = { ...opts[oi], value: e.target.value };
                                updateField(idx, { options: opts });
                              }} />
                              <Button variant="ghost" size="sm" onClick={() => updateField(idx, { options: (field.options || []).filter((_, i) => i !== oi) })}>
                                <X className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          <Button variant="outline" onClick={addField} className="w-full">
            <Plus className="h-4 w-4 mr-2" />Add Field
          </Button>
        </div>
      )}

      {/* === PAGES & DISPLAY TAB === */}
      {tab === 'pages' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
            Assign this form to pages and control when/how it appears to visitors. Each assignment can have its own display behaviour.
          </div>

          {/* Existing assignments */}
          {assignedPages.map((a, idx) => (
            <Card key={idx}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{assignmentSummary(a)}</div>
                  {a.entityId && <div className="text-xs text-gray-400 mt-0.5">ID: {a.entityId}</div>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeAssignment(idx)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Add new assignment */}
          {!addingPage ? (
            <Button variant="outline" onClick={() => setAddingPage(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />Add Page Assignment
            </Button>
          ) : (
            <Card>
              <CardTitle className="mb-4">New Assignment</CardTitle>
              <div className="space-y-4">
                {/* Page type */}
                <Select label="Show on" value={newPage.pageType || ''} onChange={e => setNewPage({ ...defaultAssignment(), pageType: e.target.value })}
                  options={PAGE_TYPES} />

                {/* Entity picker */}
                {newPage.pageType === 'college' && (
                  <CollegePicker value={newPage.entityId || null} entityName={newPage._entityName || ''}
                    onSelect={(id, name) => setNewPage(p => ({ ...p, entityId: id || null, _entityName: name }))} />
                )}
                {newPage.pageType === 'exam' && (
                  <ExamPicker value={newPage.entityId || null} entityName={newPage._entityName || ''}
                    onSelect={(id, name) => setNewPage(p => ({ ...p, entityId: id || null, _entityName: name }))} />
                )}
                {newPage.pageType === 'course' && (
                  <CoursePicker value={newPage.entityId || null} entityName={newPage._entityName || ''}
                    onSelect={(id, name) => setNewPage(p => ({ ...p, entityId: id || null, _entityName: name }))} />
                )}

                {/* Display + trigger */}
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Display As" value={newPage.displayAs || 'popup'}
                    onChange={e => setNewPage(p => ({ ...p, displayAs: e.target.value as any }))}
                    options={DISPLAY_OPTIONS} />
                  <Select label="Show Trigger" value={newPage.trigger || 'delay'}
                    onChange={e => setNewPage(p => ({ ...p, trigger: e.target.value as any }))}
                    options={TRIGGER_OPTIONS} />
                </div>

                {newPage.trigger === 'delay' && (
                  <Input type="number" label="Delay (seconds)" value={String(newPage.delaySeconds ?? 5)}
                    onChange={e => setNewPage(p => ({ ...p, delaySeconds: Number(e.target.value) }))} />
                )}
                {newPage.trigger === 'scroll' && (
                  <Input type="number" label="Show after scrolling (% of page)" value={String(newPage.scrollPercent ?? 50)}
                    onChange={e => setNewPage(p => ({ ...p, scrollPercent: Number(e.target.value) }))} />
                )}

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newPage.showOnce ?? true}
                    onChange={e => setNewPage(p => ({ ...p, showOnce: e.target.checked }))} />
                  <span>Show only once per visitor (remember in localStorage)</span>
                </label>

                <div className="flex gap-2 pt-2">
                  <Button onClick={addAssignment}>Add Assignment</Button>
                  <Button variant="secondary" onClick={() => { setAddingPage(false); setNewPage(defaultAssignment()); }}>Cancel</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
