import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssignment, useCreateAssignment, useUpdateAssignment } from '../hooks/useAssignments';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useColleges } from '@/features/colleges/hooks/useColleges';
import { usePages } from '@/features/pages/hooks/usePages';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { SearchInput } from '@/components/ui/SearchInput';

const ALL_ACTIONS = ['read', 'update', 'delete', 'publish'] as const;

export default function AssignmentFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: assignment, isLoading: assignmentLoading } = useAssignment(id || '');
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();

  const { data: usersData } = useUsers({ limit: 100 });
  const { data: categoriesData } = useCategories({ limit: 100 });

  const [userId, setUserId] = useState('');
  const [contentType, setContentType] = useState<'college' | 'page'>('college');
  const [scope, setScope] = useState<'individual' | 'category'>('individual');
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [actions, setActions] = useState<Set<string>>(new Set(['read']));
  const [contentSearch, setContentSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: collegesData } = useColleges({ limit: 100 });
  const { data: pagesData } = usePages({ limit: 100 });

  useEffect(() => {
    if (assignment) {
      setUserId(assignment.user._id);
      setContentType(assignment.contentType);
      setScope(assignment.scope);
      if (assignment.contentId) {
        setSelectedContentIds(new Set([assignment.contentId]));
      }
      setSelectedCategories(assignment.categories);
      setActions(new Set(assignment.actions));
    }
  }, [assignment]);

  const toggleAction = (action: string) => {
    setActions((prev) => {
      const next = new Set(prev);
      if (next.has(action)) {
        next.delete(action);
      } else {
        next.add(action);
      }
      return next;
    });
  };

  const toggleContentId = (contentId: string) => {
    setSelectedContentIds((prev) => {
      const next = new Set(prev);
      if (next.has(contentId)) {
        next.delete(contentId);
      } else {
        next.add(contentId);
      }
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        // Edit mode: update single assignment
        const payload: any = {
          contentType,
          scope,
          actions: [...actions],
        };

        if (scope === 'individual') {
          payload.contentId = [...selectedContentIds][0] || null;
          payload.categories = [];
        } else {
          payload.contentId = null;
          payload.categories = selectedCategories;
        }

        await updateAssignment.mutateAsync({ id: id!, data: payload });
      } else {
        // Create mode: create one assignment per selected college/page
        const actionsArr = [...actions];

        if (scope === 'individual') {
          const ids = [...selectedContentIds];
          for (const contentId of ids) {
            await createAssignment.mutateAsync({
              user: userId,
              contentType,
              scope,
              contentId,
              categories: [],
              actions: actionsArr,
            });
          }
        } else {
          await createAssignment.mutateAsync({
            user: userId,
            contentType,
            scope,
            contentId: null,
            categories: selectedCategories,
            actions: actionsArr,
          });
        }
      }

      navigate('/admin/assignments');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && assignmentLoading) return <LoadingOverlay />;

  const users = usersData?.data || [];
  const colleges = collegesData?.data || [];
  const pages = pagesData?.data || [];
  const categories = categoriesData?.data || [];

  const contentOptions: any[] = contentType === 'college' ? colleges : pages;
  const filteredContentOptions = contentSearch
    ? contentOptions.filter((item: any) => {
        const name = (item.name || item.title || '').toLowerCase();
        return name.includes(contentSearch.toLowerCase());
      })
    : contentOptions;

  const isFormValid =
    userId &&
    actions.size > 0 &&
    (scope === 'individual' ? selectedContentIds.size > 0 : selectedCategories.length > 0);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Assignment' : 'New Assignment'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardTitle className="mb-4">Assignment Details</CardTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
                disabled={isEdit}
              >
                <option value="">Select user...</option>
                {users.map((u: any) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => {
                  setContentType(e.target.value as 'college' | 'page');
                  setSelectedContentIds(new Set());
                  setSelectedCategories([]);
                  setContentSearch('');
                  if (e.target.value === 'page') setScope('individual');
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="college">College</option>
                <option value="page">Page</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                value={scope}
                onChange={(e) => {
                  setScope(e.target.value as 'individual' | 'category');
                  setSelectedContentIds(new Set());
                  setSelectedCategories([]);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="individual">Individual</option>
                <option value="category" disabled={contentType === 'page'}>
                  Category Group
                </option>
              </select>
            </div>

            {scope === 'individual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {contentType === 'college' ? 'Colleges' : 'Pages'}
                  {selectedContentIds.size > 0 && (
                    <span className="ml-2 text-blue-600 font-normal">
                      ({selectedContentIds.size} selected)
                    </span>
                  )}
                </label>
                <SearchInput
                  value={contentSearch}
                  onChange={setContentSearch}
                  placeholder={`Search ${contentType === 'college' ? 'colleges' : 'pages'}...`}
                />
                <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                  {filteredContentOptions.length === 0 && (
                    <p className="text-sm text-gray-500 p-3">No results found.</p>
                  )}
                  {filteredContentOptions.map((item: any) => (
                    <label
                      key={item._id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContentIds.has(item._id)}
                        onChange={() => toggleContentId(item._id)}
                        className="rounded border-gray-300"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{item.name || item.title}</div>
                        {item.location?.city && (
                          <div className="text-xs text-gray-500">{item.location.city}, {item.location.state}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {scope === 'category' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((cat: any) => (
                    <label key={cat._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => toggleCategory(cat.name)}
                        className="rounded border-gray-300"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500">No categories found.</p>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Allowed Actions</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ALL_ACTIONS.map((action) => (
              <label key={action} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={actions.has(action)}
                  onChange={() => toggleAction(action)}
                  className="rounded border-gray-300"
                />
                <span className="capitalize">{action}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" isLoading={submitting} disabled={!isFormValid || submitting}>
            {isEdit ? 'Update' : 'Create'} Assignment
            {!isEdit && selectedContentIds.size > 1 && scope === 'individual' && (
              <span className="ml-1">({selectedContentIds.size})</span>
            )}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/assignments')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
