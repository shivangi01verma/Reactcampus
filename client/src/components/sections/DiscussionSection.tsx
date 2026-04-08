import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, User, Calendar } from 'lucide-react';
import api from '@/lib/axios';
import { Pagination } from '@/components/ui/Pagination';
import { queryKeys } from '@/config/queryKeys';
import type { PaginatedResponse } from '@/types/api';

interface DiscussionItem {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface DiscussionSectionProps {
  entityType: 'college' | 'course' | 'exam';
  entityId: string;
  slug: string;
}

export function DiscussionSection({ entityType, entityId, slug }: DiscussionSectionProps) {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', content: '' });
  const qc = useQueryClient();

  const queryKey = entityType === 'college'
    ? queryKeys.public.colleges.discussions(slug, { page })
    : entityType === 'course'
      ? queryKeys.public.courses.discussions(slug, { page })
      : queryKeys.public.exams.discussions(slug, { page });

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<DiscussionItem>>(`/public/${entityType}s/${slug}/discussions`, { params: { page } });
      return res.data;
    },
    enabled: !!slug,
  });

  const submitDiscussion = useMutation({
    mutationFn: (payload: typeof form) =>
      api.post('/public/discussions', {
        ...payload,
        [entityType]: entityId,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="space-y-4" id="discussion-section">
      {/* Submit form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
          <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
          Join the Discussion
        </h2>
        {submitDiscussion.isSuccess ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">Your comment has been submitted for moderation. It will appear once approved.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); submitDiscussion.mutate(form); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" required placeholder="Your Name"
                value={form.authorName}
                onChange={(e) => setForm(p => ({ ...p, authorName: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <input
                type="email" placeholder="Your Email (optional)"
                value={form.authorEmail}
                onChange={(e) => setForm(p => ({ ...p, authorEmail: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <textarea
              required placeholder="Share your thoughts, ask a question, or start a discussion..."
              value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              disabled={submitDiscussion.isPending}
              className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg disabled:opacity-50 transition-all text-sm font-medium"
            >
              {submitDiscussion.isPending ? 'Submitting...' : 'Post Comment'}
            </button>
            {submitDiscussion.isError && (
              <p className="text-sm text-red-600">Failed to submit comment. Please try again.</p>
            )}
          </form>
        )}
      </div>

      {/* Existing discussions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
          <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
          Discussion
          {data?.pagination?.total ? (
            <span className="text-sm font-normal text-gray-500">({data.pagination.total})</span>
          ) : null}
        </h2>
        {!data?.data?.length ? (
          <div className="text-center py-8">
            <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No discussions yet. Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.data.map((item) => (
              <div key={item._id} className="border-l-4 border-l-brand-200 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{item.authorName}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            ))}
            {data.pagination && (
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.pages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
