import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

import PageHero from '../components/shared/PageHero';
import InlineEnquiryForm from '../components/shared/InlineEnquiryForm';
import FaqAccordion from '../components/shared/FaqAccordion';
import FinalCtaBanner from '../components/FinalCtaBanner';
import WhatsAppIcon from '../components/shared/WhatsAppIcon';

import { contact, whatsappLink } from '../data/contact';
import { branches } from '../data/branches';
import { countries } from '../data/countries';

export default function ContactPage() {
  const containerRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // GSAP animation with cleanup
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.contact-card');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Listen for focus inside the enquiry form on mobile to hide the sticky bar
  useEffect(() => {
    const formEl = document.getElementById('enquiry');
    if (!formEl) return;

    const handleFocusIn = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        setIsInputFocused(true);
      }
    };
    const handleFocusOut = () => {
      setIsInputFocused(false);
    };

    formEl.addEventListener('focusin', handleFocusIn);
    formEl.addEventListener('focusout', handleFocusOut);
    return () => {
      formEl.removeEventListener('focusin', handleFocusIn);
      formEl.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Other 5 branches for the compact list
  const otherBranches = useMemo(() => {
    return branches.filter((b) => !b.isHeadOffice);
  }, []);

  // European countries for FAQ answer #2
  const europeanFaqAnswer = useMemo(() => {
    const euroCountries = countries.filter((c) => c.region === 'Europe');
    const n = euroCountries.length;
    const featuredEuroCountries = euroCountries
      .filter((c) => c.featured)
      .map((c) => (c.article ? `${c.article} ${c.name}` : c.name));
    let featuredList = '';
    if (featuredEuroCountries.length === 1) {
      featuredList = featuredEuroCountries[0];
    } else if (featuredEuroCountries.length > 1) {
      featuredList = `${featuredEuroCountries.slice(0, -1).join(', ')} and ${
        featuredEuroCountries[featuredEuroCountries.length - 1]
      }`;
    }
    return `We currently help students apply to universities in ${n} European countries, including ${featuredList}. You can see the full list on our Countries page. If you're considering another destination, ask us and we'll tell you what's possible.`;
  }, []);

  // FAQs per Section 4.4
  const faqs = useMemo(
    () => [
      {
        q: 'How can I book a consultation?',
        a: `Fill in the form on this page and tick "I'd like to book a consultation" to choose a date and time. You can also use Book a Free Consultation anywhere on the site, call us on ${contact.phoneDisplay}, or message us on WhatsApp.`,
      },
      {
        q: 'Which European countries do you support?',
        a: europeanFaqAnswer,
      },
      {
        q: 'What documents should I prepare?',
        a: "For your first consultation, bring your academic mark sheets and certificates, your passport if you have one, any English test scores, and your CV if you've worked. If you don't have everything yet, come anyway, and we'll tell you exactly what you'll need.",
      },
    ],
    [europeanFaqAnswer]
  );

  // LocalBusiness structured data
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Adam International',
    url: 'https://adaminternational.in',
    telephone: contact.phoneTel,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'MAF Plaza, Edappally–Panvel Highway',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Fr 09:30-17:30',
  };

  return (
    <div ref={containerRef} className="w-full pb-20 sm:pb-0 overflow-x-hidden">
      {/* Helmet SEO & Structured Data */}
      <Helmet>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Contact Adam International for guidance on European universities, courses, admissions and student visas. Call, WhatsApp, email or visit our Kochi office."
        />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      {/* 4.1 Hero */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us', active: true },
        ]}
        title="Let's Plan Your Study Abroad Journey"
        subtitle="Get personalised guidance for your European education journey."
      >
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mt-3 max-w-3xl">
          Have questions about studying in Europe? Contact Adam International
          for guidance on universities, courses, admissions and student visa
          procedures.
        </p>
      </PageHero>

      {/* 4.2 Quick Contact Cards (Overlapping hero bottom on desktop) */}
      <section className="relative z-20 -mt-8 sm:-mt-10 lg:-mt-12 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Phone (Call Us) - mobile order 1 */}
          <a
            href={`tel:${contact.phoneTel}`}
            className="contact-card order-1 lg:order-none group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-[#C9A84C] transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] flex items-center justify-center shrink-0 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Call Us
                </span>
                <span className="font-bold text-sm sm:text-base text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors block truncate">
                  {contact.phoneDisplay}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#0B1F3A]">
              <span>Call direct</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* Card 2: WhatsApp - mobile order 2 (Hide if whatsappEnabled is false) */}
          {contact.whatsappEnabled && (
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card order-2 lg:order-none group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    WhatsApp
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#0B1F3A] group-hover:text-emerald-600 transition-colors block truncate">
                    Chat with us
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-700">
                <span>Start chat</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </a>
          )}

          {/* Card 3: Mail (Email Us) - mobile order 3 */}
          <a
            href={`mailto:${contact.email}`}
            className="contact-card order-3 lg:order-none group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-[#C9A84C] transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#C9A84C] group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] flex items-center justify-center shrink-0 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Email Us
                </span>
                <span className="font-bold text-xs sm:text-sm text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors block truncate">
                  {contact.email}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#0B1F3A]">
              <span>Send email</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* Card 4: Office (Visit Our Office) - mobile order 4 */}
          <a
            href={contact.headOffice.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card order-4 lg:order-none group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-[#C9A84C] transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] flex items-center justify-center shrink-0 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Visit Our Office
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                  MAF Plaza, Edappally–Panvel Highway, Kochi
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#0B1F3A]">
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A84C]" />
            </div>
          </a>
        </div>

        {/* Office hours line under cards */}
        <div className="text-center mt-5 text-xs sm:text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span>
            Office hours:{' '}
            {contact.hours.map((h) => `${h.days}, ${h.time}`).join(' | ')}
          </span>
        </div>
      </section>

      {/* 4.3 Enquiry Form and Office (Two-column layout on desktop) */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: The Form (id="enquiry") */}
          <div
            id="enquiry"
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm scroll-mt-28"
          >
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Send Us an Enquiry
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Fill in your details and our team can assist you with your enquiry.
              </p>
            </div>

            <InlineEnquiryForm
              formType="contact"
              fields={['country', 'message']}
              fieldLabels={{
                country: 'Preferred Study Destination',
                message: 'Your Message',
              }}
              submitLabel="Submit Enquiry"
              note="Our team will contact you regarding your enquiry during working hours."
              successTitle="Thanks, we've received your enquiry."
              successText="Our team will contact you regarding your enquiry during working hours."
            />
          </div>

          {/* Right: The Office Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
                Visit Our Office
              </h3>
              <div className="mt-3">
                <div className="font-bold text-sm sm:text-base text-[#0B1F3A]">
                  {contact.headOffice.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {contact.headOffice.address}
                </div>
              </div>
            </div>

            {/* Office hours list */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <Clock className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0B1F3A] block mb-0.5">
                  Office Hours
                </span>
                {contact.hours.map((h, idx) => (
                  <div key={idx} className="text-slate-600">
                    <span className="font-medium text-slate-800">{h.days}:</span>{' '}
                    {h.time}
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                src={contact.headOffice.embedUrl}
                title="Map of Adam International head office"
                loading="lazy"
                className="w-full h-full border-0"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Get Directions Button */}
            <a
              href={contact.headOffice.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70 ml-1" />
            </a>

            {/* Other branches list */}
            <div className="pt-5 border-t border-slate-100 space-y-3.5">
              <h4 className="font-bold text-sm sm:text-base text-[#0B1F3A]">
                Our Branches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {otherBranches.map((b) => (
                  <div
                    key={b.slug}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <span className="font-semibold text-xs text-[#0B1F3A]">
                      {b.name}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {b.phone ? b.phone : 'Address coming soon'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  to="/about#branches"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
                >
                  <span>See all branches on a map</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.4 FAQs */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* 4.5 CTA */}
      <FinalCtaBanner />

      {/* Section 5: Mobile-only sticky bottom bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 transition-transform duration-200 ${
          isInputFocused
            ? 'translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <a
          href={`tel:${contact.phoneTel}`}
          className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0B1F3A] active:bg-[#13335F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#C9A84C]" />
          <span>Call</span>
        </a>

        {contact.whatsappEnabled && (
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
