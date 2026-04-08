import { Link } from 'react-router-dom';
import { ChevronRight, Banknote, GraduationCap, CheckCircle, Phone } from 'lucide-react';
import { usePublicSiteSettings } from '@/features/public-home/hooks/useSiteSettings';

export default function LoanPage() {
  const { data: settings } = usePublicSiteSettings();
  const contact = settings?.contact;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-1.5 text-sm text-brand-100 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Education Loan</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Education Loan</h1>
          <p className="text-brand-100 mt-2 max-w-2xl">
            Get guidance on education loans to fund your higher education dreams.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="flex-1 lg:w-[70%] space-y-6">
            {/* Intro Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Education Loan Assistance</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Financing your education is a crucial step towards achieving your career goals. We help you navigate the education loan process by connecting you with the right banks and financial institutions that offer competitive interest rates and flexible repayment options.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you're pursuing engineering, medical, management, or any other course, we provide guidance to help you secure the funding you need.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Loan guidance for top colleges across India',
                  'Assistance with documentation & application',
                  'Competitive interest rate comparisons',
                  'Support for both domestic & international courses',
                  'Collateral & non-collateral loan options',
                  'Flexible repayment plan guidance',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl border border-brand-100 p-6 text-center">
              <GraduationCap className="w-12 h-12 text-brand-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">More Details Coming Soon</h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                We're building a comprehensive education loan resource with partner banks, EMI calculators, and eligibility checkers. Stay tuned!
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[30%] space-y-6">
            {/* CTA Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-brand-500 text-white px-5 py-3">
                <h3 className="font-semibold">Need Loan Assistance?</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Get in touch with our team for personalized education loan guidance.
                </p>
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors justify-center"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us: {contact.phone}
                  </a>
                )}
                <Link
                  to="/contact"
                  className="flex items-center gap-2 w-full px-4 py-2.5 mt-2 border border-brand-500 text-brand-600 text-sm font-semibold rounded-lg hover:bg-brand-50 transition-colors justify-center"
                >
                  Send a Message
                </Link>
              </div>
            </div>

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
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
