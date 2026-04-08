export interface CategoryPill {
  label: string;
  icon: string;
  to: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface CtaButton {
  label: string;
  to: string;
  variant: 'primary' | 'outline';
  icon: string;
}

export interface SectionVisibility {
  featuredColleges: boolean;
  featuredCourses: boolean;
  featuredExams: boolean;
  browseByStream: boolean;
  whyChooseUs: boolean;
  cta: boolean;
}

export interface FooterLink {
  label: string;
  to: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface FooterNewsletter {
  enabled: boolean;
  title: string;
  subtitle: string;
}

export interface FooterSettings {
  tagline: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  bottomLinks: FooterLink[];
  copyrightText: string;
  newsletter: FooterNewsletter;
}

export interface SiteSettings {
  _id: string;
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: CategoryPill[];
  };
  stats: StatItem[];
  featuredColleges: any[];
  featuredCourses: any[];
  featuredExams: any[];
  sectionVisibility: SectionVisibility;
  cta: {
    title: string;
    subtitle: string;
    buttons: CtaButton[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string;
  };
  about: {
    content: string;
    mission: string;
    vision: string;
  };
  footer?: FooterSettings;
  updatedBy?: { _id: string; firstName: string; lastName: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteSettingsRequest {
  hero?: Partial<SiteSettings['hero']>;
  stats?: StatItem[];
  featuredColleges?: string[];
  featuredCourses?: string[];
  featuredExams?: string[];
  sectionVisibility?: Partial<SectionVisibility>;
  cta?: Partial<SiteSettings['cta']>;
  contact?: Partial<SiteSettings['contact']>;
  about?: Partial<SiteSettings['about']>;
  footer?: Partial<FooterSettings>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
