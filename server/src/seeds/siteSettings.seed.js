const SiteSettings = require('../models/SiteSettings.model');
const User = require('../models/User.model');
const logger = require('../config/logger');

const seedSiteSettings = async () => {
  const existing = await SiteSettings.findOne();
  if (existing) {
    logger.info('Site settings already exist, skipping seed');
    return;
  }

  const admin = await User.findOne({ email: 'admin@campusoption.com' });

  await SiteSettings.create({
    hero: {
      title: 'Discover Colleges, Courses',
      titleHighlight: '& Entrance Exams',
      subtitle: 'Get genuine information about admissions, fees, placements, and rankings for colleges across India.',
      searchPlaceholder: 'Search colleges, courses, exams...',
      categories: [
        { label: 'Engineering', icon: '', to: '/colleges?type=engineering' },
        { label: 'Medical', icon: '', to: '/colleges?type=medical' },
        { label: 'Management', icon: '', to: '/colleges?type=management' },
        { label: 'Law', icon: '', to: '/colleges?type=law' },
        { label: 'Arts', icon: '', to: '/colleges?type=arts' },
        { label: 'Science', icon: '', to: '/colleges?type=science' },
      ],
    },
    stats: [
      { label: 'Colleges Listed', value: '2,400+', icon: 'building', color: 'text-brand-600' },
      { label: 'Courses', value: '500+', icon: 'book', color: 'text-green-600' },
      { label: 'Entrance Exams', value: '100+', icon: 'file', color: 'text-blue-600' },
      { label: 'Students Helped', value: '35,000+', icon: 'users', color: 'text-purple-600' },
    ],
    cta: {
      title: 'Need Help Choosing the Right College?',
      subtitle: 'Get personalized recommendations based on your preferences, budget, and career goals.',
      buttons: [
        { label: 'Explore Colleges', to: '/colleges', variant: 'primary', icon: 'star' },
        { label: 'Browse Exams', to: '/exams', variant: 'outline', icon: 'file' },
      ],
    },
    contact: {
      email: 'info@campusoption.com',
      phone: '08042401736',
      address: '4th Floor, 563-564, Niran Arcade, RMV 2nd Stage, New BEL Road, Bangalore, Karnataka 560094',
      mapEmbedUrl: '',
    },
    about: {
      content: '<p>Campus Option is India\'s leading education portal, helping students discover the right colleges, courses, and career paths since 2014. We provide comprehensive, genuine information about thousands of educational institutions across India.</p>',
      mission: 'To empower students with accurate, comprehensive information about colleges, courses, and exams, enabling them to make well-informed decisions about their education and career.',
      vision: 'To be India\'s most trusted and comprehensive education discovery platform, connecting every student with their ideal educational opportunity.',
    },
    footer: {
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
    },
    updatedBy: admin?._id || null,
  });

  logger.info('Seeded site settings');
};

module.exports = seedSiteSettings;
