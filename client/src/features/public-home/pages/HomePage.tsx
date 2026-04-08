import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, FileText, MapPin,
  Building2, ArrowRight, Award, TrendingUp, Users, Star,
  GraduationCap, Phone, Stethoscope, Scale, Palette, FlaskConical,
  Briefcase, Calculator, Shield, GitCompare, Headphones, MessageCircle,
  Sparkles, ChevronRight,
} from 'lucide-react';
import { usePublicColleges } from '@/features/public-colleges/hooks/usePublicColleges';
import { usePublicCourses } from '@/features/public-courses/hooks/usePublicCourses';
import { usePublicExams } from '@/features/public-exams/hooks/usePublicExams';
import { usePublicSiteSettings } from '../hooks/useSiteSettings';
import { CollegeInsightsSection } from '../components/CollegeInsightsSection';
import { PageFormOverlay } from '@/features/public-forms/components/PageFormOverlay';
import { Spinner } from '@/components/ui/Spinner';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  building: Building2,
  book: BookOpen,
  file: FileText,
  users: Users,
  star: Star,
};

const DEFAULT_CATEGORIES = [
  { label: 'Engineering', icon: '', to: '/colleges?category=engineering' },
  { label: 'Medical', icon: '', to: '/colleges?category=medical' },
  { label: 'Management', icon: '', to: '/colleges?category=management' },
  { label: 'Law', icon: '', to: '/colleges?category=law' },
  { label: 'Arts', icon: '', to: '/colleges?category=arts' },
  { label: 'Science', icon: '', to: '/colleges?category=science' },
];

const DEFAULT_STATS = [
  { label: 'Colleges Listed', value: '2,400+', icon: 'building', color: 'text-brand-600' },
  { label: 'Courses', value: '500+', icon: 'book', color: 'text-green-600' },
  { label: 'Entrance Exams', value: '100+', icon: 'file', color: 'text-blue-600' },
  { label: 'Students Helped', value: '35,000+', icon: 'users', color: 'text-purple-600' },
];

const STREAMS = [
  { label: 'Engineering', desc: 'B.Tech, M.Tech & more', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-100', to: '/colleges?category=engineering' },
  { label: 'Medical', desc: 'MBBS, BDS, Nursing', icon: Stethoscope, color: 'text-red-600', bg: 'bg-red-600', lightBg: 'bg-red-50', border: 'border-red-100', to: '/colleges?category=medical' },
  { label: 'Management', desc: 'MBA, BBA, PGDM', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-100', to: '/colleges?category=management' },
  { label: 'Law', desc: 'LLB, BA LLB, LLM', icon: Scale, color: 'text-emerald-600', bg: 'bg-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-100', to: '/colleges?category=law' },
  { label: 'Arts', desc: 'BA, MA, BFA & more', icon: Palette, color: 'text-purple-600', bg: 'bg-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-100', to: '/colleges?category=arts' },
  { label: 'Science', desc: 'B.Sc, M.Sc, Research', icon: FlaskConical, color: 'text-cyan-600', bg: 'bg-cyan-600', lightBg: 'bg-cyan-50', border: 'border-cyan-100', to: '/colleges?category=science' },
];

const TRUST_POINTS = [
  { title: 'Verified Information', desc: 'All college data is verified and regularly updated by our research team.', icon: Shield },
  { title: 'Compare & Decide', desc: 'Compare colleges side by side on fees, placements, rankings, and more.', icon: GitCompare },
  { title: 'Expert Guidance', desc: 'Get free counselling from our education experts to choose the right path.', icon: Headphones },
  { title: 'Real Reviews', desc: 'Read authentic reviews from students and alumni of colleges across India.', icon: MessageCircle },
];

const STAT_ACCENT_COLORS = [
  { bg: 'bg-brand-500/15', text: 'text-brand-400', border: 'border-brand-400/20' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-400/20' },
  { bg: 'bg-accent-500/15', text: 'text-accent-400', border: 'border-accent-400/20' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-400/20' },
];

// Stream color for course cards
const STREAM_COLORS: Record<string, { top: string; iconBg: string; pill: string; pillText: string }> = {
  engineering: { top: 'bg-blue-500', iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600', pill: 'bg-blue-50 border-blue-200', pillText: 'text-blue-700' },
  medical: { top: 'bg-red-500', iconBg: 'bg-gradient-to-br from-red-500 to-red-600', pill: 'bg-red-50 border-red-200', pillText: 'text-red-700' },
  management: { top: 'bg-amber-500', iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600', pill: 'bg-amber-50 border-amber-200', pillText: 'text-amber-700' },
  law: { top: 'bg-emerald-500', iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', pill: 'bg-emerald-50 border-emerald-200', pillText: 'text-emerald-700' },
  arts: { top: 'bg-purple-500', iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600', pill: 'bg-purple-50 border-purple-200', pillText: 'text-purple-700' },
  science: { top: 'bg-cyan-500', iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', pill: 'bg-cyan-50 border-cyan-200', pillText: 'text-cyan-700' },
  commerce: { top: 'bg-teal-500', iconBg: 'bg-gradient-to-br from-teal-500 to-teal-600', pill: 'bg-teal-50 border-teal-200', pillText: 'text-teal-700' },
};

const EXAM_COLORS = [
  'bg-purple-500', 'bg-indigo-500', 'bg-violet-500',
  'bg-purple-600', 'bg-indigo-600', 'bg-violet-600',
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: settings } = usePublicSiteSettings();
  const { data: collegesData } = usePublicColleges({ limit: 6 });
  const { data: coursesData } = usePublicCourses({ limit: 6 });
  const { data: examsData } = usePublicExams({ limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const heroTitle = settings?.hero?.title || 'Discover Colleges, Courses';
  const heroHighlight = settings?.hero?.titleHighlight || '& Entrance Exams';
  const heroSubtitle = settings?.hero?.subtitle || 'Get genuine information about admissions, fees, placements, and rankings for colleges across India.';
  const heroPlaceholder = settings?.hero?.searchPlaceholder || 'Search colleges, courses, exams...';
  const rawCategories = settings?.hero?.categories?.length ? settings.hero.categories : DEFAULT_CATEGORIES;
  const categories = rawCategories.map((cat: any) => ({
    ...cat,
    to: cat.to?.replace('/colleges?type=', '/colleges?category=') || cat.to,
  }));
  const stats = settings?.stats?.length ? settings.stats : DEFAULT_STATS;

  const colleges = settings?.featuredColleges?.length ? settings.featuredColleges : collegesData?.data;
  const courses = settings?.featuredCourses?.length ? settings.featuredCourses : coursesData?.data;
  const exams = settings?.featuredExams?.length ? settings.featuredExams : examsData?.data;

  const ctaTitle = settings?.cta?.title || 'Need Help Choosing the Right College?';
  const ctaSubtitle = settings?.cta?.subtitle || 'Get personalized recommendations based on your preferences, budget, and career goals.';

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden bg-noise"
        style={{
          background: 'linear-gradient(135deg, #052a3d 0%, #08415d 25%, #0a4f70 50%, #0c5f88 75%, #08415d 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 12s ease infinite',
        }}
      >
        {/* Decorative floating blobs */}
        <div className="absolute top-10 right-[10%] w-64 h-64 bg-brand-400/10 blob-1 animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-accent-400/10 blob-2 animate-float-delay pointer-events-none" />
        <div className="absolute top-1/2 right-[30%] w-32 h-32 bg-brand-300/8 blob-1 animate-float-delay pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-brand-200 mb-6 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                India's Trusted Education Platform
              </div>
              <h1 className="heading-display">
                {heroTitle}{' '}
                <span className="text-accent-300">{heroHighlight}</span>
              </h1>
              <p className="text-brand-200/80 text-base md:text-lg mt-5 leading-relaxed max-w-lg">
                {heroSubtitle}
              </p>

              {/* Search - glassmorphic */}
              <form onSubmit={handleSearch} className="mt-8">
                <div className="flex bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-white/20">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={heroPlaceholder}
                      className="w-full pl-12 pr-4 py-4 md:py-4.5 text-gray-800 placeholder-gray-400 focus:outline-none text-sm bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold hover:from-brand-600 hover:to-brand-700 transition-all flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 md:hidden" />
                    <span className="hidden md:inline">Search</span>
                  </button>
                </div>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-brand-400 text-xs self-center mr-1">Popular:</span>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    className="px-3.5 py-1.5 text-xs font-medium text-brand-200 bg-white/8 border border-white/12 rounded-full hover:bg-white/15 hover:text-white hover:border-white/25 transition-all"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Hero image with overlapping stats */}
            <div className="hidden md:block relative animate-fade-in-up-delay-1">
              {/* Main campus image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop&q=80"
                  alt="College campus"
                  className="w-full h-[360px] object-cover"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent" />

                {/* Stats strip at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {stats.map((stat: any, idx: number) => {
                      const Icon = ICON_MAP[stat.icon] || Building2;
                      const accent = STAT_ACCENT_COLORS[idx % STAT_ACCENT_COLORS.length];
                      return (
                        <div
                          key={stat.label}
                          className="bg-white/12 backdrop-blur-md rounded-xl p-3 text-center border border-white/10 hover:bg-white/18 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg ${accent.bg} flex items-center justify-center mx-auto mb-1.5`}>
                            <Icon className={`w-4 h-4 ${accent.text}`} />
                          </div>
                          <div className="text-lg font-extrabold text-white leading-tight">{stat.value}</div>
                          <div className="text-[10px] text-brand-200 mt-0.5 leading-tight">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Floating accent card - top right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-3.5 animate-fade-in-up-delay-3 z-10 ring-1 ring-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">Placement Rate</div>
                    <div className="text-sm font-bold text-gray-900">95%+ Average</div>
                  </div>
                </div>
              </div>

              {/* Floating accent card - bottom left */}
              <div className="absolute -bottom-3 -left-4 bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-3.5 animate-fade-in-up-delay-4 z-10 ring-1 ring-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">Trusted by</div>
                    <div className="text-sm font-bold text-gray-900">35K+ Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats - visible on small screens */}
      <section className="md:hidden border-b border-gray-200 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {stats.map((stat: any) => {
              const Icon = ICON_MAP[stat.icon] || Building2;
              return (
                <div key={stat.label} className="flex items-center gap-2.5 py-4 px-3">
                  <Icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                  <div>
                    <div className="text-base font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[11px] text-gray-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Stream */}
      {settings?.sectionVisibility?.browseByStream !== false && (
        <section className="py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="heading-section text-gray-900">Browse by Stream</h2>
                <p className="text-gray-500 text-sm mt-1">Find colleges based on your preferred field</p>
              </div>
              <Link to="/colleges" className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 scrollbar-hide">
              {STREAMS.map(stream => {
                const Icon = stream.icon;
                return (
                  <Link
                    key={stream.label}
                    to={stream.to}
                    className={`group flex-shrink-0 w-36 md:w-auto flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-lg hover:shadow-gray-900/5 hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${stream.bg} flex items-center justify-center shadow-lg shadow-${stream.bg}/25 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800">{stream.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{stream.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Colleges */}
      {settings?.sectionVisibility?.featuredColleges !== false && (
        <section className="py-14 md:py-16 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full text-xs font-semibold text-brand-600 mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  Top Picks
                </div>
                <h2 className="heading-section text-gray-900">Featured Colleges</h2>
                <p className="text-gray-500 text-sm mt-1">Top-rated colleges handpicked for you</p>
              </div>
              <Link
                to="/colleges"
                className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {!colleges ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {colleges.map((college: any, idx: number) => (
                  <Link
                    key={college._id}
                    to={`/colleges/${college.slug}`}
                    className={`group bg-white rounded-2xl border border-gray-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                      idx <= 2 ? `animate-fade-in-up-delay-${idx + 1}` : ''
                    }`}
                  >
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-5">
                      <div className="flex items-start gap-3.5">
                        {college.logo ? (
                          <img src={college.logo} alt="" className="w-14 h-14 rounded-xl ring-1 ring-gray-100 shadow-sm object-contain bg-white flex-shrink-0 p-1" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-brand-500" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-[15px] leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                            {college.name}
                          </h3>
                          {college.location && (
                            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                              {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {college.ranking && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] rounded-lg font-semibold flex items-center gap-1 border border-amber-100">
                            <Award className="w-3 h-3" />
                            Rank #{college.ranking}
                          </span>
                        )}
                        {college.accreditation && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[11px] rounded-lg font-semibold border border-green-100">
                            {college.accreditation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                        {college.fees?.max > 0 ? (
                          <span className="text-sm text-gray-700 font-semibold flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                            ₹{college.fees.max >= 100000
                              ? `${(college.fees.max / 100000).toFixed(1)}L`
                              : `${(college.fees.max / 1000).toFixed(0)}K`}
                            <span className="text-[11px] text-gray-400 font-normal">/ year</span>
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="flex items-center gap-1 text-xs text-brand-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/colleges"
              className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-6"
            >
              View All Colleges <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Popular Courses */}
      {settings?.sectionVisibility?.featuredCourses !== false && (
        <section className="py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-600 mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  Trending
                </div>
                <h2 className="heading-section text-gray-900">Popular Courses</h2>
                <p className="text-gray-500 text-sm mt-1">Explore top courses across streams</p>
              </div>
              <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {!courses ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {courses.map((course: any) => {
                  const streamKey = (course.stream || '').toLowerCase();
                  const colors = STREAM_COLORS[streamKey] || { top: 'bg-brand-500', iconBg: 'bg-gradient-to-br from-brand-500 to-brand-600', pill: 'bg-brand-50 border-brand-200', pillText: 'text-brand-700' };
                  return (
                    <Link
                      key={course._id}
                      to={`/courses/${course.slug}`}
                      className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/5 transition-all duration-300"
                    >
                      <div className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-tight line-clamp-1">
                          {course.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {course.level && <span className="capitalize">{course.level}</span>}
                          {course.duration && <span> · {course.duration.value} {course.duration.unit}</span>}
                          {course.stream && <span> · {course.stream}</span>}
                        </p>
                        {course.fees?.amount > 0 && (
                          <p className="text-sm font-bold text-gray-800 mt-2.5">
                            ₹{course.fees.amount >= 100000
                              ? `${(course.fees.amount / 100000).toFixed(1)}L`
                              : `${(course.fees.amount / 1000).toFixed(0)}K`}
                            <span className="text-xs font-normal text-gray-400"> /{course.fees.per}</span>
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              to="/courses"
              className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-5"
            >
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Popular Exams */}
      {settings?.sectionVisibility?.featuredExams !== false && (
        <section className="py-14 md:py-16 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-600 mb-3">
                  <FileText className="w-3.5 h-3.5" />
                  Upcoming
                </div>
                <h2 className="heading-section text-gray-900">Popular Exams</h2>
                <p className="text-gray-500 text-sm mt-1">Upcoming entrance exams you should know about</p>
              </div>
              <Link
                to="/exams"
                className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {!exams ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              <div className="flex flex-col gap-3">
                {exams.map((exam: any, idx: number) => (
                  <Link
                    key={exam._id}
                    to={`/exams/${exam.slug}`}
                    className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl ${EXAM_COLORS[idx % EXAM_COLORS.length]} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                        {exam.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[11px] rounded-lg font-semibold capitalize border border-purple-100">
                          {exam.examType?.replace('_', ' ')}
                        </span>
                        {exam.conductedBy && (
                          <span className="text-xs text-gray-500">by {exam.conductedBy}</span>
                        )}
                        {exam.pattern?.mode && (
                          <span className="text-xs text-gray-500 capitalize">
                            · {exam.pattern.mode}
                            {exam.pattern.duration ? ` · ${exam.pattern.duration}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 flex-shrink-0 transition-all" />
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/exams"
              className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-5"
            >
              View All Exams <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* College Insights — Data Analytics Section */}
      <CollegeInsightsSection />

      {/* Why Choose Us */}
      {settings?.sectionVisibility?.whyChooseUs !== false && (
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white to-accent-50/30" />
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full text-xs font-semibold text-brand-600 mb-4">
                  <Shield className="w-3.5 h-3.5" />
                  Why Us
                </div>
                <h2 className="heading-section text-gray-900 mb-3">Why Choose Campus Option?</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-md">Trusted by thousands of students across India for accurate, unbiased college information.</p>
                <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-accent-400 rounded-full" />
              </div>
              {/* Right - numbered timeline */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-brand-200 via-brand-300 to-brand-200" />
                <div className="space-y-7">
                  {TRUST_POINTS.map((point, i) => {
                    const Icon = point.icon;
                    return (
                      <div key={point.title} className="flex gap-5 relative group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-brand-200 group-hover:border-brand-400 flex items-center justify-center z-10 shadow-sm transition-colors">
                          <Icon className="w-5 h-5 text-brand-500" />
                        </div>
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-accent-500 uppercase tracking-wider">0{i + 1}</span>
                          <h3 className="font-semibold text-gray-900 text-[15px] mt-0.5">{point.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed mt-1">{point.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {settings?.sectionVisibility?.cta !== false && (
        <section className="relative overflow-hidden bg-noise" style={{ background: 'linear-gradient(135deg, #0a4f70, #08415d 40%, #052a3d 70%, #0c5f88)' }}>
          {/* Decorative blobs */}
          <div className="absolute top-0 right-[10%] w-48 h-48 bg-brand-400/10 blob-1 animate-float pointer-events-none" />
          <div className="absolute bottom-0 left-[10%] w-36 h-36 bg-accent-400/10 blob-2 animate-float-delay pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-brand-400/20 rounded-full blur-xl" />
                <GraduationCap className="relative w-14 h-14 text-brand-300" />
              </div>
              <h2 className="heading-display text-white">{ctaTitle}</h2>
              <p className="text-brand-200/80 text-base md:text-lg mt-4 max-w-lg mx-auto">{ctaSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-bold hover:bg-brand-50 transition-colors text-sm shadow-lg shadow-black/10"
                >
                  <Building2 className="w-4 h-4" />
                  Explore Colleges
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-400/60 text-brand-200 rounded-xl font-bold hover:bg-white/10 hover:border-brand-400 transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Talk to Expert
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <PageFormOverlay pageType="homepage" />
    </div>
  );
}
