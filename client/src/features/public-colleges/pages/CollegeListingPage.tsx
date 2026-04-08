import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Building2, Award, TrendingUp, SlidersHorizontal,
  ChevronRight, Home, X, GraduationCap, ArrowRight,
} from 'lucide-react';
import { usePublicColleges } from '../hooks/usePublicColleges';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { COLLEGE_TYPES } from '@/config/constants';
import { usePublicCategories } from '@/features/categories/hooks/useCategories';

export default function CollegeListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const state = searchParams.get('state') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  const params: Record<string, any> = { page, limit: 12 };
  if (search) params.search = search;
  if (type) params.type = type;
  if (category) params.category = category;
  if (city) params['location.city'] = city;
  if (state) params['location.state'] = state;

  const { data, isLoading } = usePublicColleges(params);
  const { data: categories = [] } = usePublicCategories();

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

  const hasFilters = search || type || category || city || state;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-300/30 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-sm text-brand-300 mb-5">
            <Link to="/" className="hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90 font-medium">Colleges</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Explore Top Colleges in India</h1>
          <p className="text-brand-200/80 text-sm md:text-base max-w-2xl leading-relaxed">
            Browse {data?.pagination?.total ? `${data.pagination.total}+` : ''} colleges across India. Filter by type, location, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter Bar - overlapping banner */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-5 mb-6 -mt-8 relative z-20">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search colleges by name..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-300 focus:bg-white transition-colors"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30">
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
                  {[type, category, city, state, search].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-scale-in">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => updateParam('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug} className="capitalize">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">College Type</label>
                  <select
                    value={type}
                    onChange={(e) => updateParam('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {COLLEGE_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => updateParam('city', e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => updateParam('state', e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
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
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200 capitalize">
                {category}
                <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {type && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200 capitalize">
                {type}
                <button onClick={() => updateParam('type', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200">
                {city}
                <button onClick={() => updateParam('city', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {state && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200">
                {state}
                <button onClick={() => updateParam('state', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {data?.pagination && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-medium text-gray-700">{data.data.length}</span> of{' '}
            <span className="font-medium text-gray-700">{data.pagination.total}</span> colleges
          </p>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : !data?.data.length ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1.5">No colleges found</h3>
            <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">Try adjusting your filters or search terms to discover more colleges.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-4 py-2 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 text-sm font-medium rounded-lg transition-colors">
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {data.data.map((college) => (
                <Link
                  key={college._id}
                  to={`/colleges/${college.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="h-0.5 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 p-5">
                    <div className="flex items-start gap-4">
                      {college.logo ? (
                        <img src={college.logo} alt="" className="w-14 h-14 rounded-lg ring-4 ring-white shadow-lg object-contain bg-white flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 ring-4 ring-white shadow-lg">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors text-lg">
                              {college.name}
                            </h3>
                            {college.location && (
                              <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {(college as any).accreditation && (
                              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                {(college as any).accreditation}
                              </span>
                            )}
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full font-medium capitalize">
                            {college.type}
                          </span>
                          {college.ranking && (
                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium flex items-center gap-1 border border-amber-100">
                              <Award className="w-3 h-3" /> NIRF #{college.ranking}
                            </span>
                          )}
                          {college.fees?.max > 0 && (
                            <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium flex items-center gap-1 border border-green-100">
                              <TrendingUp className="w-3 h-3" />
                              ₹{college.fees.max >= 100000
                                ? `${(college.fees.max / 100000).toFixed(1)}L`
                                : `${(college.fees.max / 1000).toFixed(0)}K`}
                            </span>
                          )}
                        </div>

                        {college.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{college.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {data.pagination && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
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
