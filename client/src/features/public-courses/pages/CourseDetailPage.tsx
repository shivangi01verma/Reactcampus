import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, BookOpen, GraduationCap, IndianRupee, ChevronRight, Home,
  ArrowRight, ExternalLink, Award, CheckCircle, Building2, ChevronDown,
} from 'lucide-react';
import { usePublicCourse, usePublicCourseColleges, usePublicCourseSections } from '../hooks/usePublicCourses';
import { PageFormOverlay } from '@/features/public-forms/components/PageFormOverlay';
import { DiscussionSection } from '@/components/sections/DiscussionSection';
import { Spinner } from '@/components/ui/Spinner';
import type { ContentSection } from '@/types/contentSection';

// ─── Tab config ──────────────────────────────────────────────────────────────

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  syllabus: 'Syllabus',
  eligibility: 'Eligibility',
  'career-prospects': 'Career Prospects',
  'admission-process': 'Admission Process',
};

const TAB_ORDER = ['overview', 'syllabus', 'eligibility', 'career-prospects', 'admission-process'];

const SPEC_COLORS = [
  { bg: 'bg-brand-50', text: 'text-brand-700', icon: 'text-brand-500', border: 'border-brand-100' },
  { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500', border: 'border-blue-100' },
  { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500', border: 'border-amber-100' },
  { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500', border: 'border-purple-100' },
];

// ─── ReadMoreText ─────────────────────────────────────────────────────────────

function ReadMoreText({ html, maxHeight = 200 }: { html: string; maxHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (ref.current) setNeedsTruncation(ref.current.scrollHeight > maxHeight);
  }, [html, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="prose prose-sm max-w-none text-gray-700 overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded || !needsTruncation ? 'none' : `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {needsTruncation && !expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(transparent, white)' }} />
      )}
      {needsTruncation && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2 text-brand-500 hover:text-brand-600 text-sm font-semibold flex items-center gap-1">
          {expanded ? 'Read Less' : 'Read More'}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

// ─── SectionRenderer ──────────────────────────────────────────────────────────

function SectionRenderer({ section }: { section: ContentSection }) {
  const content = section.content as any;
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set());

  const toggleFaq = (i: number) => setFaqOpen(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <div className="mb-8 last:mb-0">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
        <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
        {section.title}
      </h3>

      {section.contentType === 'richtext' && (
        <ReadMoreText html={typeof content === 'string' ? content : (content?.body || '')} maxHeight={200} />
      )}

      {section.contentType === 'table' && content?.headers && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-brand-800 to-brand-900">
                {content.headers.map((h: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {content.rows?.map((row: string[], ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className={`px-4 py-3 text-sm ${ci === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.contentType === 'faq' && (
        <div className="space-y-2">
          {content?.items?.map((item: any, i: number) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-brand-50 text-left transition-colors"
              >
                <span className="font-medium text-sm text-gray-900">{item.question}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${faqOpen.has(i) ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${faqOpen.has(i) ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section.contentType === 'list' && (
        <ul className="space-y-2">
          {content?.items?.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      )}

      {section.contentType === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content?.images?.map((img: any, i: number) => (
            <div key={i} className="group relative rounded-lg overflow-hidden">
              <img src={img.url} alt={img.caption || ''} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── StickyTabBar ────────────────────────────────────────────────────────────

function StickyTabBar({ tabs, activeTab, onTabChange }: { tabs: { key: string; label: string }[]; activeTab: string; onTabChange: (t: string) => void }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div className={`sticky top-[64px] z-30 bg-white border-b border-gray-200 transition-shadow ${isSticky ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex -mb-px overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-5 py-3 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-brand-500 text-brand-600 bg-brand-50/50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = usePublicCourse(slug!);
  const { data: colleges } = usePublicCourseColleges(slug!);
  const { data: sections } = usePublicCourseSections(slug!);
  const [activeTab, setActiveTab] = useState('overview');
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Build dynamic tabs from content sections
  const { contentTabs, sectionsByTab } = useMemo(() => {
    if (!sections?.length) return { contentTabs: [], sectionsByTab: {} };
    const byTab: Record<string, ContentSection[]> = {};
    for (const s of sections) {
      if (!s.isVisible) continue;
      if (!byTab[s.sectionKey]) byTab[s.sectionKey] = [];
      byTab[s.sectionKey].push(s);
    }
    for (const key of Object.keys(byTab)) {
      byTab[key].sort((a, b) => a.order - b.order);
    }
    return { contentTabs: Object.keys(byTab), sectionsByTab: byTab };
  }, [sections]);

  const tabs = useMemo(() => {
    const tabList: { key: string; label: string }[] = [];
    const sorted = [...contentTabs].sort((a, b) => {
      const ai = TAB_ORDER.indexOf(a);
      const bi = TAB_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    for (const key of sorted) {
      // Filter out FAQ tabs if pageFeatures.faq is false
      if (key === 'faq' && course && course.pageFeatures?.faq === false) continue;
      tabList.push({ key, label: TAB_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ') });
    }

    // Add Discussion tab if enabled
    if (course && course.pageFeatures?.discussion === true) {
      tabList.push({ key: 'discussion', label: 'Discussion' });
    }

    return tabList;
  }, [contentTabs, course]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      contentAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Course not found</h2>
        <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="text-brand-500 hover:text-brand-600 font-medium text-sm">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  const quickInfoParts: string[] = [];
  if (course.level) quickInfoParts.push(course.level.charAt(0).toUpperCase() + course.level.slice(1));
  if (course.duration) quickInfoParts.push(`${course.duration.value} ${course.duration.unit}`);
  if (course.stream) quickInfoParts.push(course.stream.charAt(0).toUpperCase() + course.stream.slice(1));

  const stats: { label: string; value: string; color: string; ringColor: string; icon: any }[] = [];
  if (course.duration) {
    stats.push({ label: 'Duration', value: `${course.duration.value} ${course.duration.unit}`, color: 'bg-blue-500', ringColor: 'ring-blue-100', icon: Clock });
  }
  if (course.fees?.amount > 0) {
    stats.push({
      label: 'Fees',
      value: `₹${(course.fees.amount / 100000).toFixed(1)}L/${course.fees.per}`,
      color: 'bg-green-500',
      ringColor: 'ring-green-100',
      icon: IndianRupee,
    });
  }
  if (course.specializations?.length) {
    stats.push({ label: 'Specializations', value: `${course.specializations.length}+`, color: 'bg-brand-500', ringColor: 'ring-brand-100', icon: Award });
  }

  const hasSections = tabs.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-brand-500 transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/courses" className="hover:text-brand-500 transition-colors">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800 font-medium truncate max-w-[250px]">{course.name}</span>
          </nav>

          {/* Header card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{course.name}</h1>
                  {quickInfoParts.length > 0 && (
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                      {quickInfoParts.map((part, i) => (
                        <span key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          {i > 0 && <span className="text-gray-300">|</span>}
                          {part}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-medium">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Apply Now
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-500 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat boxes */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 border-t border-gray-100 bg-gray-50/50">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-4 ${i > 0 ? 'border-l border-gray-100' : ''}`}>
                      <div className={`${stat.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ${stat.ringColor}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-900">{stat.value}</div>
                        <div className="text-[11px] text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar — only show if there are sections */}
      {hasSections && (
        <StickyTabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 py-6" ref={contentAreaRef}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Dynamic content sections tab */}
            {hasSections && sectionsByTab[activeTab] && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                {sectionsByTab[activeTab].map((section) => (
                  <SectionRenderer key={section._id} section={section} />
                ))}
              </div>
            )}

            {/* If no sections, or active tab has no content, show the static content */}
            {(!hasSections || !sectionsByTab[activeTab]) && activeTab !== 'discussion' && (
              <>
                {/* About */}
                {course.description && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                      <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                      About this Course
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{course.description}</p>
                  </div>
                )}

                {/* Eligibility */}
                {course.eligibility && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                      <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                      Eligibility Criteria
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{course.eligibility}</p>
                  </div>
                )}

                {/* Fees */}
                {course.fees?.amount > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                      <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                      Fee Structure
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-900">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Fee Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Tuition Fee</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {course.fees.currency || '₹'}{course.fees.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 capitalize">{course.fees.per}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {course.specializations?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                      <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                      Specializations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.specializations.map((spec: string, i: number) => {
                        const color = SPEC_COLORS[i % SPEC_COLORS.length];
                        return (
                          <div key={i} className={`flex items-center gap-2 px-3 py-2.5 ${color.bg} rounded-lg border ${color.border}`}>
                            <CheckCircle className={`w-4 h-4 ${color.icon} flex-shrink-0`} />
                            <span className={`text-sm font-medium ${color.text}`}>{spec}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Discussion tab */}
            {activeTab === 'discussion' && course && (
              <DiscussionSection entityType="course" entityId={course._id} slug={slug!} />
            )}

            {/* Colleges Offering This Course — always shown below sections */}
            {colleges && colleges.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  Colleges Offering {course.name}
                </h2>
                <div className="space-y-3">
                  {colleges.map((college) => (
                    <Link
                      key={college._id}
                      to={`/colleges/${college.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 card-hover"
                    >
                      {college.logo ? (
                        <img src={college.logo} alt="" className="w-12 h-12 rounded-lg ring-4 ring-white shadow-lg object-contain bg-white flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 ring-4 ring-white shadow-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors">{college.name}</h3>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {college.location?.city && (
                            <span className="text-xs text-gray-500">{college.location.city}{college.location.state ? `, ${college.location.state}` : ''}</span>
                          )}
                          {college.ranking && (
                            <span className="text-xs text-blue-600 font-medium">NIRF #{college.ranking}</span>
                          )}
                          {(college as any).accreditation && (
                            <span className="text-xs text-green-600 font-medium">{(college as any).accreditation}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            {/* CTA Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-brand-500 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Interested in this course?</h3>
              <p className="text-xs text-gray-500 mb-4">Get details on fees, eligibility, and colleges</p>
              <button className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg transition-all text-sm font-medium mb-2">
                Apply Now
              </button>
              <button className="w-full py-2.5 border border-brand-500 text-brand-600 rounded-xl hover:bg-brand-50 transition-colors text-sm font-medium">
                Download Brochure
              </button>
            </div>

            {/* Quick Links (tabs) — only if sections exist */}
            {hasSections && tabs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-accent-500 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent-500 rounded-full" />
                  Quick Links
                </h3>
                <div className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors text-left"
                    >
                      {tab.label}
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Course Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-gray-400 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gray-400 rounded-full" />
                Course Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-xs text-gray-500">Level</dt>
                  <dd className="text-xs font-medium text-gray-900 capitalize">{course.level}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-xs text-gray-500">Duration</dt>
                  <dd className="text-xs font-medium text-gray-900">{course.duration.value} {course.duration.unit}</dd>
                </div>
                {course.stream && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Stream</dt>
                    <dd className="text-xs font-medium text-gray-900 capitalize">{course.stream}</dd>
                  </div>
                )}
                {course.fees?.amount > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Fees</dt>
                    <dd className="text-xs font-medium text-gray-900">
                      {course.fees.currency || '₹'}{course.fees.amount.toLocaleString()} / {course.fees.per}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Explore More */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-brand-500 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full" />
                Explore More
              </h3>
              <div className="space-y-1">
                <Link
                  to="/courses"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  All Courses
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/colleges"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  Colleges
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/exams"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  Entrance Exams
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {course && <PageFormOverlay pageType="course" entityId={course._id} />}
    </div>
  );
}
