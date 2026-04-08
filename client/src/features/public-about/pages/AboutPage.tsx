import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Target, Eye } from 'lucide-react';
import { usePublicSiteSettings } from '@/features/public-home/hooks/useSiteSettings';
import { Spinner } from '@/components/ui/Spinner';

export default function AboutPage() {
  const { data: settings, isLoading } = usePublicSiteSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const about = settings?.about;
  const contact = settings?.contact;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-1.5 text-sm text-brand-100 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">About Us</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
          <p className="text-brand-100 mt-2 max-w-2xl">
            Learn more about Campus Option and our mission to help students find the right education.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="flex-1 lg:w-[70%] space-y-6">
            {/* About Content */}
            {about?.content && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
              </div>
            )}

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about?.mission && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-brand-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{about.mission}</p>
                </div>
              )}
              {about?.vision && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{about.vision}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[30%] space-y-6">
            {/* Contact Info */}
            {contact && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-brand-500 text-white px-5 py-3">
                  <h3 className="font-semibold">Contact Information</h3>
                </div>
                <div className="p-5 space-y-4">
                  {contact.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a href={`mailto:${contact.email}`} className="text-sm text-gray-900 hover:text-brand-600">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a href={`tel:${contact.phone}`} className="text-sm text-gray-900 hover:text-brand-600">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm text-gray-900">{contact.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-5 py-3 border-b">
                <h3 className="font-semibold text-gray-800 text-sm">Quick Links</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                <li>
                  <Link to="/colleges" className="block px-5 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors">
                    Browse Colleges
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="block px-5 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors">
                    Explore Courses
                  </Link>
                </li>
                <li>
                  <Link to="/exams" className="block px-5 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors">
                    View Exams
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block px-5 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
