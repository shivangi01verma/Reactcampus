import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { usePublicSiteSettings } from '@/features/public-home/hooks/useSiteSettings';
import { useSubmitContact } from '../hooks/useContact';
import { Spinner } from '@/components/ui/Spinner';

export default function ContactPage() {
  const { data: settings, isLoading } = usePublicSiteSettings();
  const submitMutation = useSubmitContact();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const contact = settings?.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form, {
      onSuccess: () => {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-1.5 text-sm text-brand-100 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Contact Us</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-brand-100 mt-2 max-w-2xl">
            Have a question or need help? Reach out to us and we'll get back to you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <div className="flex-1 lg:w-[70%]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        rows={5}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                    </button>
                    {submitMutation.isError && (
                      <p className="text-red-500 text-sm mt-2">
                        Failed to send message. Please try again.
                      </p>
                    )}
                  </form>
                </>
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

            {/* Google Maps Embed */}
            {contact?.mapEmbedUrl && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
