import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import { usePublicSiteSettings } from '@/features/public-home/hooks/useSiteSettings';
import type { FooterSettings } from '@/types/siteSettings';

const DEFAULT_FOOTER: FooterSettings = {
  tagline: 'Your trusted platform for discovering colleges, courses, and exams across India.',
  sections: [
    {
      title: 'Explore',
      links: [
        { label: 'Colleges', to: '/colleges' },
        { label: 'Courses', to: '/courses' },
        { label: 'Exams', to: '/exams' },
        { label: 'Loan', to: '/loan' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
    {
      title: 'Top Colleges',
      links: [
        { label: 'Engineering Colleges', to: '/colleges?category=engineering' },
        { label: 'Medical Colleges', to: '/colleges?category=medical' },
        { label: 'Management Colleges', to: '/colleges?category=management' },
        { label: 'Law Colleges', to: '/colleges?category=law' },
      ],
    },
    {
      title: 'Top Courses',
      links: [
        { label: 'B.Tech', to: '/courses?level=undergraduate' },
        { label: 'MBA', to: '/courses?level=postgraduate' },
        { label: 'MBBS', to: '/courses?stream=medical' },
        { label: 'B.Com', to: '/courses?stream=commerce' },
      ],
    },
    {
      title: 'Top Exams',
      links: [
        { label: 'Engineering Exams', to: '/exams?category=engineering' },
        { label: 'Medical Exams', to: '/exams?category=medical' },
        { label: 'Management Exams', to: '/exams?category=management' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'facebook', url: '#', label: 'fb' },
    { platform: 'linkedin', url: '#', label: 'in' },
    { platform: 'twitter', url: '#', label: 'X' },
    { platform: 'youtube', url: '#', label: 'yt' },
  ],
  bottomLinks: [
    { label: 'Privacy Policy', to: '/pages/privacy-policy' },
    { label: 'Terms of Use', to: '/pages/terms-of-use' },
  ],
  copyrightText: '',
  newsletter: {
    enabled: true,
    title: 'Stay Updated',
    subtitle: 'Get the latest college news, exam dates & counselling tips.',
  },
};

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-semibold mb-5 text-xs tracking-[0.15em] uppercase">
      {children}
      <span className="block w-8 h-0.5 bg-gradient-to-r from-accent-500 to-accent-400 rounded-full mt-2.5" />
    </h4>
  );
}

export function Footer() {
  const { data: settings } = usePublicSiteSettings();
  const [email, setEmail] = useState('');

  const footer = settings?.footer || DEFAULT_FOOTER;
  const contact = settings?.contact;
  const newsletter = footer.newsletter ?? DEFAULT_FOOTER.newsletter;
  const sections = footer.sections?.length ? footer.sections : DEFAULT_FOOTER.sections;
  const socialLinks = footer.socialLinks?.length ? footer.socialLinks : DEFAULT_FOOTER.socialLinks;
  const bottomLinks = footer.bottomLinks?.length ? footer.bottomLinks : DEFAULT_FOOTER.bottomLinks;
  const tagline = footer.tagline || DEFAULT_FOOTER.tagline;
  const copyrightText = footer.copyrightText || `\u00A9 ${new Date().getFullYear()} Campus Option. All rights reserved.`;

  return (
    <footer>
      {/* Newsletter Strip */}
      {newsletter.enabled && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400" />
          <div className="absolute inset-0 bg-noise opacity-40" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="text-white text-center md:text-left">
                <h3 className="font-bold text-xl tracking-tight">{newsletter.title}</h3>
                <p className="text-white/80 text-sm mt-1">{newsletter.subtitle}</p>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
                className="flex w-full md:w-auto"
              >
                <div className="flex flex-1 md:w-80 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden focus-within:bg-white/20 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 text-sm text-white placeholder-white/60 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-white text-accent-600 text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-1.5"
                  >
                    Subscribe
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="bg-gray-950 bg-noise text-gray-400 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Campus<span className="text-gradient">Option</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 mb-6">
                {tagline}
              </p>
              <div className="space-y-3 text-sm">
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    {contact.email}
                  </a>
                )}
                {contact?.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    {contact.phone}
                  </a>
                )}
                {contact?.address && (
                  <p className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    <span className="pt-1.5">{contact.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <ColumnHeading>{section.title}</ColumnHeading>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all">
                        <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social links row */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-12 pt-8 border-t border-gray-800/60">
              <span className="text-xs text-gray-600 font-medium uppercase tracking-wider mr-2">Follow us</span>
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800/60 border border-gray-700/50 flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all hover:-translate-y-0.5"
                >
                  {social.label || social.platform.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

        {/* Bottom bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>{copyrightText}</p>
          {bottomLinks.length > 0 && (
            <div className="flex items-center gap-1">
              {bottomLinks.map((link, i) => (
                <span key={link.to} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-gray-700">·</span>}
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
