import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, ChevronDown, ExternalLink, ChevronRight, Home, Building2,
  Award, TrendingUp, FileText, ArrowRight, Calendar, Shield,
} from 'lucide-react';
import { usePublicPage } from '../hooks/usePublicPages';
import { Spinner } from '@/components/ui/Spinner';

// ─── ReadMore for description ────────────────────────────────────────────────

function ReadMoreHTML({ html, maxHeight = 160 }: { html: string; maxHeight?: number }) {
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
        className="prose prose-sm md:prose-base max-w-none text-gray-700
          prose-headings:text-gray-900 prose-a:text-brand-600 prose-strong:text-gray-800
          prose-p:leading-relaxed prose-li:leading-relaxed
          overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: expanded || !needsTruncation ? 'none' : `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {needsTruncation && !expanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,1) 100%)',
          }}
        />
      )}
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold
            transition-colors duration-200 group/readmore"
        >
          {expanded ? 'Show Less' : 'Read More'}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : 'group-hover/readmore:translate-y-0.5'}`}
          />
        </button>
      )}
    </div>
  );
}

// ─── Section Heading ─────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-0">
      <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
        <span className="w-1.5 h-7 bg-gradient-to-b from-brand-500 to-brand-400 rounded-full flex-shrink-0" />
        {title}
      </h2>
      <div className="mt-4 border-b border-gray-100" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = usePublicPage(slug!);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-16 gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-gray-400 font-medium animate-pulse">Loading page...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 md:p-14 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            The page you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl
              hover:bg-brand-600 transition-colors duration-200 shadow-sm shadow-brand-500/20"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const toggleFaq = (blockIdx: number, faqIdx: number) => {
    const key = blockIdx * 1000 + faqIdx;
    setExpandedFaqs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedBlocks = [...(page.contentBlocks || [])].sort((a, b) => a.order - b.order);
  const hasColleges = page.collegeFilter?.enabled && (page as any).colleges?.length > 0;
  const hasSidebar = page.sidebarLinks && page.sidebarLinks.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ═══ Hero Banner ═══ */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 bg-noise text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-brand-200/80 mb-5 animate-fade-in-up">
            <Link to="/" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-300/50" />
            <span className="text-brand-200/60">Pages</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-300/50" />
            <span className="text-white font-medium line-clamp-1">{page.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight animate-fade-in-up-delay-1 max-w-3xl">
            {page.title}
          </h1>

          {/* Subtle meta line */}
          {page.updatedAt && (
            <p className="mt-3 text-brand-200/50 text-xs font-medium animate-fade-in-up-delay-2">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Main Column ─────────────────────────────────────── */}
          <div className={`flex-1 ${hasSidebar ? 'lg:max-w-[70%]' : ''} space-y-6 min-w-0`}>

            {/* Description Card */}
            {page.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 animate-fade-in-up">
                <ReadMoreHTML html={page.description} />
              </div>
            )}

            {/* Content Blocks */}
            {sortedBlocks.map((block, blockIdx) => (
              <div
                key={blockIdx}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up"
              >
                {block.title && <SectionHeading title={block.title} />}

                <div className="p-6 md:p-8">
                  {block.contentType === 'richtext' && (
                    <div
                      className="prose prose-sm md:prose-base max-w-none text-gray-700
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-800
                        prose-p:leading-relaxed
                        prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
                        prose-th:bg-gray-50 prose-th:text-gray-500 prose-th:px-5 prose-th:py-3
                        prose-th:text-xs prose-th:font-semibold prose-th:uppercase prose-th:tracking-wider
                        prose-td:px-5 prose-td:py-3.5 prose-td:text-sm prose-td:border-gray-100
                        prose-img:rounded-xl prose-img:shadow-sm"
                      dangerouslySetInnerHTML={{ __html: typeof block.content === 'string' ? block.content : '' }}
                    />
                  )}

                  {block.contentType === 'table' && <TableRenderer content={block.content} />}

                  {block.contentType === 'faq' && (
                    <FaqRenderer
                      content={block.content}
                      blockIdx={blockIdx}
                      expandedFaqs={expandedFaqs}
                      toggleFaq={toggleFaq}
                    />
                  )}

                  {block.contentType === 'list' && <ListRenderer content={block.content} />}
                </div>
              </div>
            ))}

            {/* ─── College Listing ────────────────────────────────── */}
            {hasColleges && (
              <div className="animate-fade-in-up">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-1.5 h-7 bg-gradient-to-b from-brand-500 to-brand-400 rounded-full flex-shrink-0" />
                    Colleges
                  </h2>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                    {(page as any).colleges.length} listed
                  </span>
                </div>

                {/* College Cards */}
                <div className="space-y-3">
                  {(page as any).colleges.map((college: any) => {
                    const hasFeesData = college.fees && (college.fees.min > 0 || college.fees.max > 0);

                    return (
                      <Link
                        key={college._id}
                        to={`/colleges/${college.slug}`}
                        className="group block bg-white rounded-2xl shadow-sm border border-gray-200 card-hover overflow-hidden
                          transition-all duration-300"
                      >
                        <div className="p-5 md:p-6">
                          {/* Row 1: Logo + Name + Arrow */}
                          <div className="flex items-start gap-4">
                            {college.logo ? (
                              <img
                                src={college.logo}
                                alt=""
                                className="w-14 h-14 rounded-xl ring-4 ring-white shadow-lg object-contain bg-white flex-shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600
                                flex items-center justify-center flex-shrink-0 ring-4 ring-white shadow-lg"
                              >
                                <Building2 className="w-7 h-7 text-white" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="font-bold text-gray-900 text-base md:text-lg
                                    group-hover:text-brand-600 transition-colors duration-200 leading-snug"
                                  >
                                    {college.name}
                                  </h3>
                                  {college.location && (
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                      <span>
                                        {college.location.city}
                                        {college.location.state ? `, ${college.location.state}` : ''}
                                      </span>
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500
                                  group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-4 ml-[72px]">
                            {college.type && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700
                                text-xs font-medium rounded-lg capitalize border border-brand-100"
                              >
                                <Building2 className="w-3 h-3" />
                                {college.type}
                              </span>
                            )}
                            {college.ranking && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700
                                text-xs font-medium rounded-lg border border-amber-100"
                              >
                                <Award className="w-3 h-3" />
                                Rank #{college.ranking}
                              </span>
                            )}
                            {(college as any).accreditation && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700
                                text-xs font-medium rounded-lg border border-green-100"
                              >
                                <Shield className="w-3 h-3" />
                                {(college as any).accreditation}
                              </span>
                            )}
                            {college.established && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600
                                text-xs font-medium rounded-lg"
                              >
                                <Calendar className="w-3 h-3" />
                                Est. {college.established}
                              </span>
                            )}
                          </div>

                          {/* Row 3: Stats bar */}
                          {(hasFeesData || college.established) && (
                            <div className="mt-4 ml-[72px] pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-0 text-sm divide-x divide-gray-200">
                                {hasFeesData && (
                                  <div className="flex items-center gap-2 pr-5">
                                    <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <div>
                                      <span className="text-xs text-gray-400 block leading-none mb-0.5">Total Fees</span>
                                      <span className="font-semibold text-gray-900 text-sm">
                                        {college.fees.max >= 100000
                                          ? `₹${(college.fees.min / 100000).toFixed(1)}L - ₹${(college.fees.max / 100000).toFixed(1)}L`
                                          : `₹${college.fees.min?.toLocaleString()} - ₹${college.fees.max?.toLocaleString()}`}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {college.established && (
                                  <div className="flex items-center gap-2 pl-5">
                                    <Calendar className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-xs text-gray-400 block leading-none mb-0.5">Established</span>
                                      <span className="font-semibold text-gray-900 text-sm">{college.established}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sidebar ─────────────────────────────────────────── */}
          {hasSidebar && (
            <aside className="lg:w-[30%] flex-shrink-0">
              <div className="lg:sticky lg:top-6 space-y-4">
                {page.sidebarLinks!.map((group, gIdx) => {
                  const accentColors = [
                    'border-l-brand-500',
                    'border-l-accent-500',
                    'border-l-emerald-500',
                    'border-l-purple-500',
                  ];
                  const accent = accentColors[gIdx % accentColors.length];

                  return (
                    <div
                      key={gIdx}
                      className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${accent}
                        overflow-hidden animate-fade-in-up`}
                    >
                      {group.title && (
                        <div className="px-5 pt-5 pb-0">
                          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                            {group.title}
                            <span className="block w-8 h-0.5 bg-accent-400 rounded-full mt-2" />
                          </h3>
                        </div>
                      )}
                      <div className="p-2 pt-3">
                        {group.links.map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            to={link.url}
                            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl
                              text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600
                              transition-all duration-200 group/link"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-400
                                group-hover/link:text-brand-500 transition-colors duration-200" />
                              <span className="truncate">{link.label}</span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300
                              group-hover/link:text-brand-500 group-hover/link:translate-x-0.5
                              flex-shrink-0 transition-all duration-200" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Table Renderer ──────────────────────────────────────────────────────────

function TableRenderer({ content }: { content: unknown }) {
  if (!content) return null;

  let tableData: { headers?: string[]; rows?: string[][] };
  try {
    tableData = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid table data</div>;
  }

  if (!tableData.headers && !tableData.rows) return null;

  const isRankCell = (value: string) => /^\d{1,3}$/.test(value.trim());

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse">
        {tableData.headers && (
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {tableData.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-100">
          {tableData.rows?.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`${rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                hover:bg-brand-50/40 transition-colors duration-150`}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-5 py-3.5 text-sm ${
                    cIdx === 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {cIdx === 0 && isRankCell(cell) ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                      bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100"
                    >
                      {cell}
                    </span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: cell }} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── FAQ Renderer ────────────────────────────────────────────────────────────

function FaqRenderer({
  content,
  blockIdx,
  expandedFaqs,
  toggleFaq,
}: {
  content: unknown;
  blockIdx: number;
  expandedFaqs: Record<number, boolean>;
  toggleFaq: (blockIdx: number, faqIdx: number) => void;
}) {
  if (!content) return null;

  let faqs: { question: string; answer: string }[];
  try {
    faqs = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid FAQ data</div>;
  }

  if (!Array.isArray(faqs)) return null;

  return (
    <div className="space-y-2.5">
      {faqs.map((faq, fIdx) => {
        const key = blockIdx * 1000 + fIdx;
        const isOpen = expandedFaqs[key];

        return (
          <div
            key={fIdx}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'border-brand-200 bg-brand-50/30 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <button
              onClick={() => toggleFaq(blockIdx, fIdx)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 ${
                isOpen ? '' : 'hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3.5">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-300 ${
                    isOpen
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {fIdx + 1}
                </span>
                <span className={`font-medium text-sm md:text-base transition-colors duration-200 ${
                  isOpen ? 'text-gray-900' : 'text-gray-800'
                }`}>
                  {faq.question}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 ml-3 transition-all duration-300 ${
                  isOpen ? 'rotate-180 text-brand-500' : 'text-gray-400'
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-5 pt-1 pl-14">
                <div
                  className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none
                    prose-a:text-brand-600 prose-strong:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── List Renderer ───────────────────────────────────────────────────────────

function ListRenderer({ content }: { content: unknown }) {
  if (!content) return null;

  let items: string[];
  try {
    items = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid list data</div>;
  }

  if (!Array.isArray(items)) return null;

  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-700">
          <span className="mt-[7px] h-2.5 w-2.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-400
            flex-shrink-0 shadow-sm shadow-brand-500/20" />
          <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
