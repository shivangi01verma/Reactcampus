import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings2, Layout, BarChart3, Star, Phone, Info, Eye, PanelBottom } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '../hooks/useSiteSettings';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/config/permissions';
import { Spinner } from '@/components/ui/Spinner';
import type { SiteSettings, UpdateSiteSettingsRequest, StatItem, CtaButton, CategoryPill, SectionVisibility, FooterSection, FooterLink, SocialLink, FooterNewsletter } from '@/types/siteSettings';

const TABS = [
  { key: 'hero', label: 'Hero', icon: Layout },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
  { key: 'featured', label: 'Featured', icon: Star },
  { key: 'cta', label: 'CTA', icon: Settings2 },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'about', label: 'About', icon: Info },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function SiteSettingsPage() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission(PERMISSIONS.SITE_SETTINGS_UPDATE);
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage homepage content, contact info, and about page.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {settings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'hero' && <HeroTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'stats' && <StatsTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'featured' && <FeaturedTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'cta' && <CtaTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'contact' && <ContactTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'about' && <AboutTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'footer' && <FooterTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
        </div>
      )}
    </div>
  );
}

// ─── Hero Tab ──────────────────────────────────────────────────────────────────

function HeroTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [title, setTitle] = useState(settings.hero?.title || '');
  const [titleHighlight, setTitleHighlight] = useState(settings.hero?.titleHighlight || '');
  const [subtitle, setSubtitle] = useState(settings.hero?.subtitle || '');
  const [searchPlaceholder, setSearchPlaceholder] = useState(settings.hero?.searchPlaceholder || '');
  const [categories, setCategories] = useState<CategoryPill[]>(settings.hero?.categories || []);

  useEffect(() => {
    setTitle(settings.hero?.title || '');
    setTitleHighlight(settings.hero?.titleHighlight || '');
    setSubtitle(settings.hero?.subtitle || '');
    setSearchPlaceholder(settings.hero?.searchPlaceholder || '');
    setCategories(settings.hero?.categories || []);
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ hero: { title, titleHighlight, subtitle, searchPlaceholder, categories } });
  };

  const addCategory = () => {
    setCategories([...categories, { label: '', icon: '', to: '' }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof CategoryPill, value: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight (second line)</label>
          <input type="text" value={titleHighlight} onChange={(e) => setTitleHighlight(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
        <input type="text" value={searchPlaceholder} onChange={(e) => setSearchPlaceholder(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Category Pills</label>
          {canEdit && (
            <button onClick={addCategory} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={cat.label} onChange={(e) => updateCategory(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={cat.icon} onChange={(e) => updateCategory(i, 'icon', e.target.value)} placeholder="Icon (emoji)" readOnly={!canEdit} className="w-24 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={cat.to} onChange={(e) => updateCategory(i, 'to', e.target.value)} placeholder="Link" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              {canEdit && (
                <button onClick={() => removeCategory(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Stats Tab ─────────────────────────────────────────────────────────────────

function StatsTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [stats, setStats] = useState<StatItem[]>(settings.stats || []);

  useEffect(() => { setStats(settings.stats || []); }, [settings]);

  const handleSave = () => { onSave.mutate({ stats }); };

  const addStat = () => {
    setStats([...stats, { label: '', value: '', icon: 'building', color: 'text-brand-500' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Stats Counter Items</label>
        {canEdit && (
          <button onClick={addStat} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        )}
      </div>
      <div className="space-y-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
            <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value (e.g. 1000+)" readOnly={!canEdit} className="w-32 border rounded-lg px-3 py-1.5 text-sm" />
            <select value={stat.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)} disabled={!canEdit} className="w-32 border rounded-lg px-3 py-1.5 text-sm">
              <option value="building">Building</option>
              <option value="book">Book</option>
              <option value="file">File</option>
              <option value="users">Users</option>
            </select>
            <select value={stat.color} onChange={(e) => updateStat(i, 'color', e.target.value)} disabled={!canEdit} className="w-40 border rounded-lg px-3 py-1.5 text-sm">
              <option value="text-brand-500">Orange</option>
              <option value="text-green-500">Green</option>
              <option value="text-blue-500">Blue</option>
              <option value="text-purple-500">Purple</option>
              <option value="text-red-500">Red</option>
            </select>
            {canEdit && (
              <button onClick={() => removeStat(i)} className="text-red-500 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Featured Tab ──────────────────────────────────────────────────────────────

const DEFAULT_VISIBILITY: SectionVisibility = {
  featuredColleges: true,
  featuredCourses: true,
  featuredExams: true,
  browseByStream: true,
  whyChooseUs: true,
  cta: true,
};

const SECTION_LABELS: Record<keyof SectionVisibility, string> = {
  featuredColleges: 'Featured Colleges',
  featuredCourses: 'Popular Courses',
  featuredExams: 'Popular Exams',
  browseByStream: 'Browse by Stream',
  whyChooseUs: 'Why Choose Us',
  cta: 'CTA Banner',
};

function FeaturedTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [collegeIds, setCollegeIds] = useState('');
  const [courseIds, setCourseIds] = useState('');
  const [examIds, setExamIds] = useState('');
  const [visibility, setVisibility] = useState<SectionVisibility>({ ...DEFAULT_VISIBILITY, ...settings.sectionVisibility });

  useEffect(() => {
    setCollegeIds((settings.featuredColleges || []).map((c: any) => c._id || c).join(', '));
    setCourseIds((settings.featuredCourses || []).map((c: any) => c._id || c).join(', '));
    setExamIds((settings.featuredExams || []).map((c: any) => c._id || c).join(', '));
    setVisibility({ ...DEFAULT_VISIBILITY, ...settings.sectionVisibility });
  }, [settings]);

  const parseIds = (str: string) => str.split(',').map((s) => s.trim()).filter(Boolean);

  const toggleSection = (key: keyof SectionVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave.mutate({
      featuredColleges: parseIds(collegeIds),
      featuredCourses: parseIds(courseIds),
      featuredExams: parseIds(examIds),
      sectionVisibility: visibility,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Visibility Toggles */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">Section Visibility</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">Toggle sections on/off to control which blocks appear on the homepage.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(SECTION_LABELS) as (keyof SectionVisibility)[]).map((key) => (
            <label
              key={key}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                visibility[key]
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              } ${!canEdit ? 'pointer-events-none opacity-60' : ''}`}
            >
              <span className="text-sm font-medium text-gray-700">{SECTION_LABELS[key]}</span>
              <button
                type="button"
                role="switch"
                aria-checked={visibility[key]}
                onClick={() => canEdit && toggleSection(key)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 ${
                  visibility[key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                    visibility[key] ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Featured Items</h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter comma-separated MongoDB ObjectIDs. Leave empty to show the latest items on the homepage.
        </p>
      </div>

      {/* Current featured items */}
      {settings.featuredColleges?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Colleges</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredColleges.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured College IDs</label>
        <textarea value={collegeIds} onChange={(e) => setCollegeIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {settings.featuredCourses?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Courses</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredCourses.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Course IDs</label>
        <textarea value={courseIds} onChange={(e) => setCourseIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {settings.featuredExams?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Exams</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredExams.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Exam IDs</label>
        <textarea value={examIds} onChange={(e) => setExamIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── CTA Tab ───────────────────────────────────────────────────────────────────

function CtaTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [title, setTitle] = useState(settings.cta?.title || '');
  const [subtitle, setSubtitle] = useState(settings.cta?.subtitle || '');
  const [buttons, setButtons] = useState<CtaButton[]>(settings.cta?.buttons || []);

  useEffect(() => {
    setTitle(settings.cta?.title || '');
    setSubtitle(settings.cta?.subtitle || '');
    setButtons(settings.cta?.buttons || []);
  }, [settings]);

  const handleSave = () => { onSave.mutate({ cta: { title, subtitle, buttons } }); };

  const addButton = () => {
    setButtons([...buttons, { label: '', to: '', variant: 'primary', icon: '' }]);
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: keyof CtaButton, value: string) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value } as CtaButton;
    setButtons(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Subtitle</label>
        <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Buttons</label>
          {canEdit && (
            <button onClick={addButton} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Button
            </button>
          )}
        </div>
        <div className="space-y-2">
          {buttons.map((btn, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={btn.label} onChange={(e) => updateButton(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={btn.to} onChange={(e) => updateButton(i, 'to', e.target.value)} placeholder="Link" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <select value={btn.variant} onChange={(e) => updateButton(i, 'variant', e.target.value)} disabled={!canEdit} className="w-28 border rounded-lg px-3 py-1.5 text-sm">
                <option value="primary">Primary</option>
                <option value="outline">Outline</option>
              </select>
              {canEdit && (
                <button onClick={() => removeButton(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Contact Tab ───────────────────────────────────────────────────────────────

function ContactTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [email, setEmail] = useState(settings.contact?.email || '');
  const [phone, setPhone] = useState(settings.contact?.phone || '');
  const [address, setAddress] = useState(settings.contact?.address || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(settings.contact?.mapEmbedUrl || '');

  useEffect(() => {
    setEmail(settings.contact?.email || '');
    setPhone(settings.contact?.phone || '');
    setAddress(settings.contact?.address || '');
    setMapEmbedUrl(settings.contact?.mapEmbedUrl || '');
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ contact: { email, phone, address, mapEmbedUrl } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
        <input type="text" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} placeholder="https://www.google.com/maps/embed?..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── About Tab ─────────────────────────────────────────────────────────────────

function AboutTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [content, setContent] = useState(settings.about?.content || '');
  const [mission, setMission] = useState(settings.about?.mission || '');
  const [vision, setVision] = useState(settings.about?.vision || '');

  useEffect(() => {
    setContent(settings.about?.content || '');
    setMission(settings.about?.mission || '');
    setVision(settings.about?.vision || '');
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ about: { content, mission, vision } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About Content (HTML)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
        <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
        <textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={3} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Footer Tab ─────────────────────────────────────────────────────────────────

function FooterTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [tagline, setTagline] = useState(settings.footer?.tagline || '');
  const [sections, setSections] = useState<FooterSection[]>(settings.footer?.sections || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.footer?.socialLinks || []);
  const [bottomLinks, setBottomLinks] = useState<FooterLink[]>(settings.footer?.bottomLinks || []);
  const [copyrightText, setCopyrightText] = useState(settings.footer?.copyrightText || '');
  const [newsletter, setNewsletter] = useState<FooterNewsletter>(
    settings.footer?.newsletter || { enabled: true, title: 'Stay Updated', subtitle: '' }
  );

  useEffect(() => {
    setTagline(settings.footer?.tagline || '');
    setSections(settings.footer?.sections || []);
    setSocialLinks(settings.footer?.socialLinks || []);
    setBottomLinks(settings.footer?.bottomLinks || []);
    setCopyrightText(settings.footer?.copyrightText || '');
    setNewsletter(settings.footer?.newsletter || { enabled: true, title: 'Stay Updated', subtitle: '' });
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ footer: { tagline, sections, socialLinks, bottomLinks, copyrightText, newsletter } });
  };

  // ── Section helpers ──
  const addSection = () => {
    setSections([...sections, { title: '', links: [] }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], title };
    setSections(updated);
  };

  const addSectionLink = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex] = { ...updated[sectionIndex], links: [...updated[sectionIndex].links, { label: '', to: '' }] };
    setSections(updated);
  };

  const removeSectionLink = (sectionIndex: number, linkIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      links: updated[sectionIndex].links.filter((_, i) => i !== linkIndex),
    };
    setSections(updated);
  };

  const updateSectionLink = (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => {
    const updated = [...sections];
    const links = [...updated[sectionIndex].links];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    updated[sectionIndex] = { ...updated[sectionIndex], links };
    setSections(updated);
  };

  // ── Social link helpers ──
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '', label: '' }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  // ── Bottom link helpers ──
  const addBottomLink = () => {
    setBottomLinks([...bottomLinks, { label: '', to: '' }]);
  };

  const removeBottomLink = (index: number) => {
    setBottomLinks(bottomLinks.filter((_, i) => i !== index));
  };

  const updateBottomLink = (index: number, field: keyof FooterLink, value: string) => {
    const updated = [...bottomLinks];
    updated[index] = { ...updated[index], [field]: value };
    setBottomLinks(updated);
  };

  return (
    <div className="space-y-6">
      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
        <textarea value={tagline} onChange={(e) => setTagline(e.target.value)} rows={2} readOnly={!canEdit} placeholder="Short description shown in the footer brand area" className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Footer Sections</h3>
          {canEdit && (
            <button onClick={addSection} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
          )}
        </div>
        <div className="space-y-4">
          {sections.map((section, si) => (
            <div key={si} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(si, e.target.value)}
                  placeholder="Section title (e.g. Explore)"
                  readOnly={!canEdit}
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm font-medium"
                />
                {canEdit && (
                  <button onClick={() => removeSection(si)} className="text-red-500 hover:text-red-600 p-1" title="Remove section">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2 ml-2">
                {section.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateSectionLink(si, li, 'label', e.target.value)}
                      placeholder="Label"
                      readOnly={!canEdit}
                      className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => updateSectionLink(si, li, 'to', e.target.value)}
                      placeholder="URL (e.g. /colleges)"
                      readOnly={!canEdit}
                      className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                    />
                    {canEdit && (
                      <button onClick={() => removeSectionLink(si, li)} className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {canEdit && (
                  <button onClick={() => addSectionLink(si)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1">
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">Social Links</h3>
          {canEdit && (
            <button onClick={addSocialLink} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {socialLinks.map((social, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={social.platform}
                onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                disabled={!canEdit}
                className="w-36 border rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="">Platform...</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
              </select>
              <input
                type="text"
                value={social.url}
                onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                placeholder="URL"
                readOnly={!canEdit}
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                value={social.label}
                onChange={(e) => updateSocialLink(i, 'label', e.target.value)}
                placeholder="Display label"
                readOnly={!canEdit}
                className="w-28 border rounded-lg px-3 py-1.5 text-sm"
              />
              {canEdit && (
                <button onClick={() => removeSocialLink(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">Bottom Links</h3>
          {canEdit && (
            <button onClick={addBottomLink} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">Links shown in the footer bottom bar (e.g. Privacy Policy, Terms of Use).</p>
        <div className="space-y-2">
          {bottomLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateBottomLink(i, 'label', e.target.value)}
                placeholder="Label"
                readOnly={!canEdit}
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                value={link.to}
                onChange={(e) => updateBottomLink(i, 'to', e.target.value)}
                placeholder="URL"
                readOnly={!canEdit}
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              />
              {canEdit && (
                <button onClick={() => removeBottomLink(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
        <input
          type="text"
          value={copyrightText}
          onChange={(e) => setCopyrightText(e.target.value)}
          readOnly={!canEdit}
          placeholder={`Leave empty for default: \u00A9 ${new Date().getFullYear()} Campus Option. All rights reserved.`}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Newsletter Strip</h3>
        <div className="space-y-3">
          <label
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
              newsletter.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            } ${!canEdit ? 'pointer-events-none opacity-60' : ''}`}
          >
            <span className="text-sm font-medium text-gray-700">Show Newsletter Strip</span>
            <button
              type="button"
              role="switch"
              aria-checked={newsletter.enabled}
              onClick={() => canEdit && setNewsletter({ ...newsletter, enabled: !newsletter.enabled })}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 ${
                newsletter.enabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                  newsletter.enabled ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={newsletter.title}
                onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })}
                readOnly={!canEdit}
                className="w-full border rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
              <input
                type="text"
                value={newsletter.subtitle}
                onChange={(e) => setNewsletter({ ...newsletter, subtitle: e.target.value })}
                readOnly={!canEdit}
                className="w-full border rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Save Button ───────────────────────────────────────────────────────────────

function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <div className="pt-4 border-t">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Save className="w-4 h-4" />
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
