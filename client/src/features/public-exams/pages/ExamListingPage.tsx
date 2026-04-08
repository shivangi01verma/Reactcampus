import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, FileText, SlidersHorizontal,
  ChevronRight, Home, X, Monitor, Calendar, ArrowRight,
} from 'lucide-react';
import { usePublicExams } from '../hooks/usePublicExams';
import { usePublicCategories } from '@/features/categories/hooks/useCategories';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { EXAM_TYPES } from '@/config/constants';

export default function ExamListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const examType = searchParams.get('examType') || '';
  const category = searchParams.get('category') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = usePublicCategories();

  const params: Record<string, any> = { page, limit: 12 };
  if (search) params.search = search;
  if (examType) params.examType = examType;
  if (category) params.category = category;

  const { data, isLoading } = usePublicExams(params);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasFilters = search || examType || category;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 bg-noise text-white relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-sm text-brand-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Exams</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore Entrance Exams</h1>
          <p className="text-brand-200 text-sm md:text-base">
            Browse {data?.pagination?.total ? `${data.pagination.total}+` : ''} exams. Find eligibility, dates, and exam patterns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter Bar - overlapping banner */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 mb-6 -mt-6 relative z-20">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search exams by name..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-md shadow-brand-500/20">
                Search
              </button>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasFilters
                  ? 'border-brand-500 text-brand-600 bg-brand-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">
                  {[examType, category, search].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-scale-in">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => updateParam('examType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent capitalize"
                  >
                    <option value="">All Types</option>
                    {EXAM_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => updateParam('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent capitalize"
                  >
                    <option value="">All Categories</option>
                    {(categoriesData || []).map((c: any) => (
                      <option key={c._id} value={c.slug} className="capitalize">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-scale-in">
            <span className="text-xs text-gray-500 font-medium">Active:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200">
                &ldquo;{search}&rdquo;
                <button onClick={() => { updateParam('search', ''); setSearchInput(''); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {examType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200 capitalize">
                {examType.replace('_', ' ')}
                <button onClick={() => updateParam('examType', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200 capitalize">
                {category.replace('-', ' ')}
                <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {data?.pagination && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-medium text-gray-700">{data.data.length}</span> of{' '}
            <span className="font-medium text-gray-700">{data.pagination.total}</span> exams
          </p>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : !data?.data.length ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No exams found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Try adjusting your filters or search terms to discover more exams.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 text-sm font-medium rounded-lg transition-colors">
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {data.data.map((exam) => (
                <Link
                  key={exam._id}
                  to={`/exams/${exam.slug}`}
                  className="group relative block bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-brand-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          {/* Left: name/type */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors text-base mb-1">
                              {exam.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full font-medium capitalize border border-brand-100">
                                {exam.examType?.replace('_', ' ')}
                              </span>
                              {exam.categories?.map((cat: string) => (
                                <span key={cat} className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full font-medium capitalize border border-purple-100">
                                  {cat}
                                </span>
                              ))}
                              {exam.conductedBy && (
                                <span className="text-xs text-gray-500">
                                  by <span className="font-medium text-gray-700">{exam.conductedBy}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Right: pattern stats */}
                          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                            {exam.pattern?.mode && (
                              <span className="flex items-center gap-1 capitalize px-2 py-1 bg-gray-50 rounded-lg">
                                <Monitor className="w-3 h-3 text-gray-400" />
                                {exam.pattern.mode}
                              </span>
                            )}
                            {exam.pattern?.duration && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                {exam.pattern.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:hidden text-xs text-gray-500 mt-1">
                          {exam.pattern?.mode && (
                            <span className="flex items-center gap-1 capitalize">
                              <Monitor className="w-3 h-3 text-gray-400" />
                              {exam.pattern.mode}
                            </span>
                          )}
                          {exam.pattern?.duration && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {exam.pattern.duration}
                            </span>
                          )}
                        </div>

                        {exam.importantDates?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium border border-amber-100">
                              {exam.importantDates.length} important date{exam.importantDates.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {data.pagination && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.pages}
                  onPageChange={(p) => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', String(p));
                    setSearchParams(next);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
