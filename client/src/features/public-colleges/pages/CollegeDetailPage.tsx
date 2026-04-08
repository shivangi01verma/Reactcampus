import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, BookOpen, Star, MessageSquare, Phone, ExternalLink,
  ChevronDown, Building2, Download, ArrowRight, ChevronRight,
  Award, TrendingUp, GraduationCap, FileText, Home,
} from 'lucide-react';
import { usePublicCollege, usePublicCollegeReviews, usePublicCollegeSections } from '../hooks/usePublicColleges';
import { PageFormOverlay } from '@/features/public-forms/components/PageFormOverlay';
import { DiscussionSection } from '@/components/sections/DiscussionSection';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import { StarRating } from '@/components/ui/StarRating';
import { Pagination } from '@/components/ui/Pagination';
import type { ContentSection } from '@/types/contentSection';

// ─── Constants ──────────────────────────────────────────────────────────────────

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  about: 'About',
  'courses-fee': 'Courses & Fees',
  placements: 'Placements',
  admission: 'Admission',
  admissions: 'Admissions',
  'campus-life': 'Campus life',
  cutoff: 'Cutoff',
  scholarship: 'Scholarship',
  faculty: 'Faculty',
  infrastructure: 'Infrastructure',
};

const TAB_ORDER = ['placements', 'about', 'admissions', 'campus-life', 'overview', 'courses-fee', 'admission', 'cutoff', 'scholarship', 'faculty', 'infrastructure'];

const SIDEBAR_ACCENTS = ['border-l-brand-500', 'border-l-accent-500', 'border-l-gray-400', 'border-l-emerald-500'];

// ─── ReadMoreText ───────────────────────────────────────────────────────────────

function ReadMoreText({ html, maxHeight = 200 }: { html: string; maxHeight?: number }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [html, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-sm max-w-none text-gray-700 overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded || !needsTruncation ? 'none' : `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {needsTruncation && !expanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, white)' }}
        />
      )}
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-brand-500 hover:text-brand-600 text-sm font-semibold flex items-center gap-1"
        >
          {expanded ? 'Read Less' : 'Read More'}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

// ─── Breadcrumbs ────────────────────────────────────────────────────────────────

function Breadcrumbs({ college }: { college: any }) {
  const crumbs: { label: string; to?: string }[] = [
    { label: 'Home', to: '/' },
    { label: 'Colleges', to: '/colleges' },
  ];

  if (college.location?.state) {
    crumbs.push({ label: college.location.state, to: `/colleges?state=${encodeURIComponent(college.location.state)}` });
  }
  if (college.location?.city) {
    crumbs.push({ label: college.location.city, to: `/colleges?city=${encodeURIComponent(college.location.city)}` });
  }
  crumbs.push({ label: college.name });

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-brand-500 transition-colors">
              {i === 0 ? <Home className="w-3.5 h-3.5" /> : crumb.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── HeroSection ────────────────────────────────────────────────────────────────

function HeroSection({
  college,
  reviewsData,
  onTabChange,
}: {
  college: any;
  reviewsData: any;
  onTabChange: (tab: string) => void;
}) {
  const avgRating = useMemo(() => {
    if (!reviewsData?.data?.length) return null;
    const sum = reviewsData.data.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (sum / reviewsData.data.length).toFixed(1);
  }, [reviewsData]);

  const quickInfoParts: string[] = [];
  if (college.type) quickInfoParts.push(college.type.charAt(0).toUpperCase() + college.type.slice(1));
  if (college.established) quickInfoParts.push(`Estd ${college.established}`);
  if (college.accreditation) quickInfoParts.push(college.accreditation);
  if (college.affiliation) quickInfoParts.push(college.affiliation);

  const stats: { label: string; value: string; color: string; ringColor: string; icon: any }[] = [];
  if (college.ranking) {
    stats.push({ label: 'NIRF Ranking', value: `#${college.ranking}`, color: 'bg-blue-500', ringColor: 'ring-blue-100', icon: Award });
  }
  if (college.fees?.max > 0) {
    const maxFee = college.fees.max >= 100000
      ? `${(college.fees.max / 100000).toFixed(1)}L`
      : `${(college.fees.max / 1000).toFixed(0)}K`;
    stats.push({ label: 'Total Fees', value: `₹${maxFee}`, color: 'bg-green-500', ringColor: 'ring-green-100', icon: TrendingUp });
  }
  if (college.courses?.length) {
    stats.push({ label: 'Courses', value: `${college.courses.length}+`, color: 'bg-brand-500', ringColor: 'ring-brand-100', icon: GraduationCap });
  }
  if (college.exams?.length) {
    stats.push({ label: 'Exams Accepted', value: `${college.exams.length}`, color: 'bg-purple-500', ringColor: 'ring-purple-100', icon: FileText });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
      {/* Taller top banner */}
      {college.coverImage ? (
        <div className="h-40 md:h-52 bg-gray-200 relative overflow-hidden rounded-t-xl">
          <img src={college.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 rounded-t-xl" />
      )}

      <div className="p-5 md:p-6">
        {/* Logo - overlapping banner */}
        <div className={`relative z-10 ${college.coverImage ? '-mt-16 mb-3' : '-mt-14 mb-3'}`}>
          {college.logo ? (
            <img src={college.logo} alt={college.name} className="w-20 h-20 rounded-xl ring-4 ring-white shadow-lg object-cover bg-white" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center ring-4 ring-white shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        {/* Info - always below the banner */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{college.name}</h1>
              {college.location && (
                <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                </p>
              )}
            </div>
            {avgRating && (
              <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl px-3 py-1.5 text-center shadow-lg shadow-green-500/20">
                <div className="text-lg font-bold leading-none">{avgRating}</div>
                <div className="text-[10px] mt-0.5 opacity-90">{reviewsData.data.length} reviews</div>
              </div>
            )}
          </div>

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
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-medium"
              onClick={() => onTabChange('reviews')}
            >
              <Phone className="w-3.5 h-3.5" />
              Apply Now
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-500 text-brand-500 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium">
              <Download className="w-3.5 h-3.5" />
              Download Brochure
            </button>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stat boxes */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-gray-100 bg-gray-50/50">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-4 ${i > 0 ? 'border-l border-gray-100' : ''}`}
              >
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
  );
}

// ─── StickyTabBar ───────────────────────────────────────────────────────────────

function StickyTabBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        className={`sticky top-[64px] z-30 bg-white border-b border-gray-200 transition-shadow ${
          isSticky ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex -mb-px overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-5 py-3 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-brand-500 text-brand-600 bg-brand-50/60 rounded-t-lg'
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

// ─── SectionRenderer (Enhanced) ─────────────────────────────────────────────────

function SectionRenderer({ section }: { section: ContentSection }) {
  const content = section.content as any;
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set());

  const toggleFaq = (i: number) => {
    setFaqOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="mb-8 last:mb-0">
      {/* Orange left-border heading */}
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
              <div
                className={`overflow-hidden transition-all duration-200 ${faqOpen.has(i) ? 'max-h-96' : 'max-h-0'}`}
              >
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
              <img
                src={img.url}
                alt={img.caption || ''}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
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

// ─── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar({
  college,
  tabs,
  onTabChange,
}: {
  college: any;
  tabs: { key: string; label: string }[];
  onTabChange: (tab: string) => void;
}) {
  const details: { label: string; value: string }[] = [];
  if (college.established) details.push({ label: 'Established', value: String(college.established) });
  if (college.accreditation) details.push({ label: 'Accreditation', value: college.accreditation });
  if (college.affiliation) details.push({ label: 'Affiliation', value: college.affiliation });
  if (college.type) details.push({ label: 'Type', value: college.type.charAt(0).toUpperCase() + college.type.slice(1) });
  if (college.location?.address) details.push({ label: 'Address', value: college.location.address });
  if (college.location?.city) details.push({ label: 'City', value: college.location.city });
  if (college.location?.state) details.push({ label: 'State', value: college.location.state });

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
      {/* CTA Card */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${SIDEBAR_ACCENTS[0]} p-5`}>
        <h3 className="font-semibold text-gray-900 mb-1">
          Interested in {college.name.length > 30 ? college.name.slice(0, 30) + '...' : college.name}?
        </h3>
        <p className="text-xs text-gray-500 mb-4">Get details on fees, admission, placements</p>
        <button
          className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg transition-all text-sm font-medium mb-2"
          onClick={() => onTabChange('reviews')}
        >
          Apply Now
        </button>
        <button className="w-full py-2.5 border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors text-sm font-medium">
          Download Brochure
        </button>
      </div>

      {/* Quick Links */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${SIDEBAR_ACCENTS[1]} p-5`}>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent-500 rounded-full" />
          Quick Links
        </h3>
        <div className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors text-left"
            >
              {tab.label}
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* College Details */}
      {details.length > 0 && (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${SIDEBAR_ACCENTS[2]} p-5`}>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gray-400 rounded-full" />
            College Details
          </h3>
          <dl className="space-y-3">
            {details.map((d, i) => (
              <div key={i} className="flex justify-between gap-3">
                <dt className="text-xs text-gray-500 flex-shrink-0">{d.label}</dt>
                <dd className="text-xs font-medium text-gray-900 text-right">{d.value}</dd>
              </div>
            ))}
            {college.website && (
              <div className="flex justify-between gap-3">
                <dt className="text-xs text-gray-500 flex-shrink-0">Website</dt>
                <dd>
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-500 hover:text-brand-600 truncate block max-w-[160px]"
                  >
                    Visit Website
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Facilities */}
      {college.facilities?.length > 0 && (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${SIDEBAR_ACCENTS[3]} p-5`}>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            Facilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {college.facilities.map((f: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium border border-emerald-100">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: college, isLoading } = usePublicCollege(slug!);
  const [activeTab, setActiveTab] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewsData } = usePublicCollegeReviews(slug!, { page: reviewPage });
  const { data: sections } = usePublicCollegeSections(slug!);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  const [reviewForm, setReviewForm] = useState({
    authorName: '', authorEmail: '', rating: 5, title: '', content: '',
  });
  const submitReview = useMutation({
    mutationFn: (data: typeof reviewForm) => api.post(`/public/reviews`, { ...data, college: college?._id }),
  });

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
      if (key === 'faq' && college && (college as any).pageFeatures?.faq === false) continue;
      tabList.push({ key, label: TAB_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ') });
    }

    if (!tabList.find(t => t.key === 'courses')) {
      tabList.push({ key: 'courses', label: 'Courses' });
    }
    tabList.push({ key: 'reviews', label: 'Reviews' });

    // Add Discussion tab if enabled
    if (college && (college as any).pageFeatures?.discussion === true) {
      tabList.push({ key: 'discussion', label: 'Discussion' });
    }

    return tabList;
  }, [contentTabs, college]);

  // Auto-select first tab when tabs are loaded
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    // Scroll to content area
    setTimeout(() => {
      contentAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  // ── Loading / Empty States ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16">
        <Building2 className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">College not found</h2>
        <p className="text-gray-500 mb-4">The college you're looking for doesn't exist or has been removed.</p>
        <Link to="/colleges" className="text-brand-500 hover:text-brand-600 font-medium text-sm">
          ← Back to Colleges
        </Link>
      </div>
    );
  }

  const col = college as any;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs college={col} />

        {/* Hero Section */}
        <HeroSection college={col} reviewsData={reviewsData} onTabChange={handleTabChange} />
      </div>

      {/* Sticky Tab Bar */}
      <StickyTabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 py-6" ref={contentAreaRef}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Dynamic content tabs */}
            {sectionsByTab[activeTab] && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                {sectionsByTab[activeTab].map((section) => (
                  <SectionRenderer key={section._id} section={section} />
                ))}
              </div>
            )}

            {/* Courses tab (table format) */}
            {activeTab === 'courses' && !sectionsByTab['courses'] && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  Courses Offered
                </h2>
                {!col.courses?.length ? (
                  <p className="text-gray-500 text-sm">No courses listed yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-900">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Course Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Level</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Fees</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {col.courses.map((course: any, i: number) => (
                          <tr key={course._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm">
                              <Link to={`/courses/${course.slug}`} className="font-medium text-brand-600 hover:text-brand-700">
                                {course.name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{course.level}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {course.duration?.value} {course.duration?.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {course.fees?.amount
                                ? `₹${(course.fees.amount / 100000).toFixed(1)}L / ${course.fees.per}`
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Discussion tab */}
            {activeTab === 'discussion' && college && (
              <DiscussionSection entityType="college" entityId={college._id} slug={slug!} />
            )}

            {/* Reviews tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4" id="review-section">
                {/* Write a Review */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                    Write a Review
                  </h2>
                  {submitReview.isSuccess ? (
                    <p className="text-green-600 font-medium">Thank you! Your review has been submitted for moderation.</p>
                  ) : (
                    <form
                      onSubmit={(e) => { e.preventDefault(); submitReview.mutate(reviewForm); }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text" required placeholder="Your Name"
                          value={reviewForm.authorName}
                          onChange={(e) => setReviewForm(p => ({ ...p, authorName: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                        />
                        <input
                          type="email" required placeholder="Your Email"
                          value={reviewForm.authorEmail}
                          onChange={(e) => setReviewForm(p => ({ ...p, authorEmail: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <StarRating rating={reviewForm.rating} interactive size="lg" onChange={(v) => setReviewForm(p => ({ ...p, rating: v }))} />
                      </div>
                      <input
                        type="text" required placeholder="Review Title"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(p => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                      />
                      <textarea
                        required placeholder="Write your review..."
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm(p => ({ ...p, content: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                      />
                      <button
                        type="submit"
                        disabled={submitReview.isPending}
                        className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg disabled:opacity-50 transition-all text-sm font-medium"
                      >
                        {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                      </button>
                      {submitReview.isError && (
                        <p className="text-sm text-red-600">Failed to submit review. Please try again.</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Existing Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                    Reviews
                  </h2>
                  {!reviewsData?.data.length ? (
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                  ) : (
                    <div className="space-y-4">
                      {reviewsData.data.map((review) => {
                        const ratingColor = review.rating >= 4 ? 'border-l-green-500' : review.rating >= 3 ? 'border-l-amber-500' : 'border-l-red-400';
                        return (
                          <div key={review._id} className={`border-l-4 ${ratingColor} pl-4 pb-4 border-b border-gray-100 last:border-b-0 rounded-xl`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-medium text-gray-900">{review.authorName}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.title && <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>}
                            <p className="text-sm text-gray-600">{review.content}</p>
                          </div>
                        );
                      })}
                      {reviewsData.pagination && (
                        <Pagination
                          page={reviewsData.pagination.page}
                          totalPages={reviewsData.pagination.pages}
                          onPageChange={setReviewPage}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar college={col} tabs={tabs} onTabChange={handleTabChange} />
        </div>
      </div>
      <PageFormOverlay pageType="college" entityId={col._id} />
    </div>
  );
}
