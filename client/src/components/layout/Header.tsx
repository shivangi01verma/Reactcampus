import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Search, Menu, X, ChevronDown, GraduationCap, BookOpen, FileText, LayoutDashboard, LogIn, Info, Banknote, Phone } from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Colleges',
    to: '/colleges',
    icon: GraduationCap,
    sub: [
      { label: 'All Colleges', to: '/colleges' },
      { label: 'Engineering', to: '/colleges?category=engineering' },
      { label: 'Medical', to: '/colleges?category=medical' },
      { label: 'Management', to: '/colleges?category=management' },
    ],
  },
  {
    label: 'Courses',
    to: '/courses',
    icon: BookOpen,
    sub: [
      { label: 'All Courses', to: '/courses' },
      { label: 'B.Tech', to: '/courses?level=undergraduate' },
      { label: 'MBA', to: '/courses?level=postgraduate' },
    ],
  },
  {
    label: 'Exams',
    to: '/exams',
    icon: FileText,
    sub: [
      { label: 'All Exams', to: '/exams' },
      { label: 'Engineering', to: '/exams?category=engineering' },
      { label: 'Medical', to: '/exams?category=medical' },
    ],
  },
  {
    label: 'Loan',
    to: '/loan',
    icon: Banknote,
    sub: [],
  },
  {
    label: 'More',
    to: '/about',
    icon: Info,
    sub: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

export function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchExpanded(false);
    }
  };

  return (
    <>
      {/* Sentinel for scroll detection */}
      <div ref={sentinelRef} className="h-0 w-full absolute top-0 left-0" />

      {/* Thin top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500" />

      <header className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-gray-900/5 border-b border-gray-100' : 'border-b border-transparent'}`}>
        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Campus<span className="text-gradient">Option</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.sub.length > 0 ? setOpenDropdown(item.label) : undefined}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.to}
                    className="relative flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold text-gray-600 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50/50"
                  >
                    {item.label}
                    {item.sub.length > 0 && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  {openDropdown === item.label && item.sub.length > 0 && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 py-2 mt-1 z-50 animate-slide-down">
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-l border-t border-gray-100 rotate-45" />
                      {item.sub.map(sub => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className="flex items-center gap-3 mx-1.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-brand-400" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search + Auth */}
            <div className="flex items-center gap-2.5">
              {/* Desktop Search - expandable */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className={`relative flex items-center transition-all duration-300 ${searchExpanded ? 'w-56 lg:w-64' : 'w-9'}`}>
                  <button
                    type="button"
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                      searchExpanded ? 'text-brand-600' : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <Search className="w-[18px] h-[18px]" />
                  </button>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className={`absolute left-9 top-0 h-9 border border-gray-200 rounded-xl text-sm pl-3 pr-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-300 transition-all duration-300 ${
                      searchExpanded ? 'w-[calc(100%-2.25rem)] opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                    onBlur={() => { if (!search) setSearchExpanded(false); }}
                  />
                </div>
              </form>

              {/* Contact */}
              <a href="tel:+919999999999" className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-600 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>Talk to Expert</span>
              </a>

              {/* Auth Button */}
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4 md:hidden">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleges, courses, exams..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-300 focus:bg-white"
                  />
                </div>
              </form>
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`animate-fade-in-up-delay-${Math.min(idx + 1, 4)}`}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
