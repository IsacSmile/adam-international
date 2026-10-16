import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  MapPin,
  Award,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe2,
} from 'lucide-react';

import Breadcrumb from '../components/shared/Breadcrumb';
import EventCard from '../components/shared/EventCard';
import FormattedText from '../components/shared/FormattedText';
import InlineEnquiryForm from '../components/shared/InlineEnquiryForm';
import Lightbox from '../components/shared/Lightbox';
import FinalCtaBanner from '../components/FinalCtaBanner';
import NotFoundPage from './NotFoundPage';

import { useAppointment } from '../context/AppointmentContext';
import {
  getEventDateLabel,
  getEventStatus,
  isRegistrationOpen,
} from '../lib/events';
import { useEvent, useEvents, DraftPreviewBanner, ContentError } from '../hooks/useContent';
import { countries } from '../data/countries';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { openAppointment } = useAppointment();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: event, loading, error, notFound, isDraft, refresh } = useEvent(slug);
  const { data: allEvents } = useEvents();

  // Event JSON-LD schema (ONLY for spot admissions with exact date)
  const eventJsonLd = useMemo(() => {
    if (!event || event.type !== 'spot-admission' || !event.date) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationEvent',
      name: event.title,
      description: event.summary,
      startDate: event.date,
      endDate: event.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: event.location
        ? {
            '@type': 'Place',
            name: event.location,
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.location,
            },
          }
        : undefined,
      organizer: {
        '@type': 'Organization',
        name: event.organisedBy || 'Adam International',
        url: 'https://adaminternational.in',
      },
    };
  }, [event]);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-screen">
        <div className="bg-[#0B1F3A] py-16 px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="max-w-[1240px] mx-auto space-y-4">
            <div className="h-4 bg-white/20 rounded w-1/4" />
            <div className="h-10 bg-white/20 rounded w-3/4" />
            <div className="h-5 bg-white/10 rounded w-1/2" />
          </div>
        </div>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-8 bg-white rounded-2xl p-8 space-y-6">
              <div className="aspect-[1024/765] bg-slate-100 rounded-xl" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-4/6" />
              </div>
            </div>
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || (!event && !error)) {
    return <NotFoundPage />;
  }

  if (error) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-screen py-20 px-4">
        <ContentError onRetry={refresh} />
      </div>
    );
  }

  const status = getEventStatus(event);
  const isUpcoming = status === 'upcoming';
  const isAward = event.type === 'award';
  const isSpain = event.slug === 'spain-spot-admission-2026';

  const countryObj = event.country
    ? countries.find((c) => c.slug.toLowerCase() === event.country.toLowerCase())
    : null;
  const flag = countryObj?.flag || '';
  const dateLabel = getEventDateLabel(event);

  // Other events (up to 3)
  const otherEvents = (allEvents || [])
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full bg-[#FAF7F2] min-h-screen ${isDraft ? 'pt-8' : ''}`}>
      {isDraft && <DraftPreviewBanner />}
      <Helmet>
        <title>{event.title}</title>
        <meta name="description" content={event.summary} />
        <meta property="og:image" content={event.poster || event.image || '/logo234.webp'} />
        {isDraft && <meta name="robots" content="noindex, nofollow" />}
        {eventJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(eventJsonLd)}
          </script>
        )}
      </Helmet>

      {/* 1. Hero banner */}
      <section className="relative bg-[#0B1F3A] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Background visual: Country photo or award banner */}
        {isAward ? (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B1F3A] via-[#142B4C] to-[#0B1F3A]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        ) : event.image ? (
          <div className="absolute inset-0 z-0">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-[#0B1F3A]" />
        )}

        {/* Ambient grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb: Home / Events / {title} */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/events' },
                { label: event.title, active: true },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            {/* Type badge and status badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  isAward
                    ? 'bg-[#C9A84C]/25 text-[#DFBE7A] border border-[#C9A84C]/40'
                    : 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                }`}
              >
                {isAward ? 'Achievement' : 'Spot Admission'}
              </span>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  isUpcoming
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-white/10 text-slate-300 border border-white/20'
                }`}
              >
                {isUpcoming ? 'Upcoming' : 'Past event'}
              </span>

              {flag && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                  <span className="text-base leading-none">{flag}</span>
                  <span>{countryObj?.name}</span>
                </span>
              )}
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              {event.title}
            </h1>

            {/* Tagline under title if exists */}
            {event.tagline && (
              <p className="text-lg sm:text-xl text-[#DFBE7A] font-semibold leading-relaxed">
                {event.tagline}
              </p>
            )}

            {/* Date line + Location line (only if location exists) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-sm text-slate-300">
              {dateLabel && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C9A84C]" />
                  <span className="font-semibold text-white">{dateLabel}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Spot admissions only: Highlight pill, condition note, and Register button */}
            {!isAward && event.highlight && (
              <div className="pt-4 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  <span>{event.highlight}</span>
                </div>

                {event.conditionNote && (
                  <p className="text-xs text-slate-300">
                    *{event.conditionNote}
                  </p>
                )}

                {isRegistrationOpen(event) ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={scrollToRegister}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#d9b85c] text-[#0B1F3A] font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Register Interest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : !isAward && isUpcoming ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAppointment()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
                    >
                      <span>Registration not open yet — talk to an advisor</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
                    </button>
                  </div>
                ) : !isAward && (
                  <div className="pt-2">
                    <span className="inline-block px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300">
                      Registration closed
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content: Two columns on desktop, stacked on mobile */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Body Paragraphs & Closing Line */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            {/* Full Poster first (rounded, shadow, full width of column), clicking opens Lightbox */}
            {event.poster && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full text-left rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] cursor-zoom-in block"
                  aria-label={`View full poster for ${event.title}`}
                >
                  <div className="relative aspect-[1024/765] w-full bg-[#0B1F3A]/5 flex items-center justify-center overflow-hidden">
                    <img
                      src={event.poster}
                      alt={`${event.title} poster`}
                      width={event.posterWidth || 1024}
                      height={event.posterHeight || 765}
                      className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1F3A]/85 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none flex items-center gap-1.5 shadow-md">
                      <ExternalLink className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Click to view full size</span>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Render body paragraphs */}
            {event.body && (
              <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {(Array.isArray(event.body)
                  ? event.body
                  : String(event.body).split(/\r?\n\s*\r?\n/)
                ).map((para, idx) => (
                  <p key={idx}>
                    <FormattedText text={para} />
                  </p>
                ))}
              </div>
            )}

            {/* Closing Line */}
            {event.closingLine && (
              <div className="pt-6 border-t border-slate-200">
                <p
                  className={`text-base sm:text-lg text-[#0B1F3A] leading-snug ${
                    isSpain ? 'italic font-bold' : 'font-bold'
                  }`}
                >
                  <FormattedText text={event.closingLine} />
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Event Details Card */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-md space-y-5">
              <h2 className="text-lg font-bold text-[#0B1F3A] pb-3 border-b border-slate-200 flex items-center justify-between">
                <span>Event Details</span>
                <Clock className="w-4 h-4 text-[#C9A84C]" />
              </h2>

              <dl className="divide-y divide-slate-100 text-xs sm:text-sm space-y-3">
                {/* Date row */}
                {dateLabel && (
                  <div className="flex items-start justify-between gap-3 pt-3 first:pt-0">
                    <dt className="text-slate-500 font-medium">Date</dt>
                    <dd className="font-semibold text-slate-800 text-right">{dateLabel}</dd>
                  </div>
                )}

                {/* Facts rows from client data */}
                {event.facts &&
                  event.facts.map((fact, index) => {
                    // Award shows awardingBody only if confirmed
                    if (fact.label === 'Awarded by' && !event.awardingBody) return null;
                    return (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-3 pt-3"
                      >
                        <dt className="text-slate-500 font-medium">{fact.label}</dt>
                        <dd className="font-semibold text-slate-800 text-right">
                          <FormattedText text={fact.value} />
                        </dd>
                      </div>
                    );
                  })}
              </dl>

              {/* Spot admissions: Link to country page */}
              {!isAward && countryObj && (
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/countries/${countryObj.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0B1F3A] bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-[#0B1F3A] transition-all text-center"
                  >
                    <Globe2 className="w-4 h-4 text-[#C9A84C]" />
                    <span>Explore {countryObj.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* 3. Registration Section (Spot admissions only) */}
        {!isAward && (
          <section id="register" className="mt-16 sm:mt-20 scroll-mt-28">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg">
              {isRegistrationOpen(event) ? (
                <>
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-1">
                      Event Registration
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mb-2">
                      Register Your Interest
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Leave your details and our team will contact you with the event date, venue and next steps.
                    </p>
                  </div>

                  {/* Read-only event title displayed above the form */}
                  <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Selected Event
                      </span>
                      <span className="font-bold text-sm sm:text-base text-[#0B1F3A]">
                        {event.title}
                      </span>
                    </div>
                    {dateLabel && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0">
                        {dateLabel}
                      </span>
                    )}
                  </div>

                  {/* Form */}
                  <InlineEnquiryForm
                    formType="event"
                    initialValues={{
                      eventSlug: event.slug,
                      country: countryObj?.name || '',
                    }}
                    fields={['qualification', 'country', 'message']}
                    submitLabel="Register Interest"
                    successTitle="Thanks, you're registered."
                    successText="Our team will contact you with the event details, usually within one working day."
                  />
                </>
              ) : isUpcoming ? (
                /* Upcoming event but registration is closed */
                <div className="py-8 sm:py-12 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-200/80">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    Registration not open yet — talk to an advisor
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Registrations for this event have not opened yet. Talk to an advisor for questions or upcoming intakes.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAppointment()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-sm font-semibold text-[#C9A84C] transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Talk to an Advisor</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Past event state */
                <div className="py-8 sm:py-12 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    Registration closed
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This event has ended. Talk to an advisor about upcoming spot admissions.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openAppointment()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-sm font-semibold text-[#C9A84C] transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Book a Free Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. More Events Section (up to 3 other events, hide if none) */}
        {otherEvents.length > 0 && (
          <section className="mt-20 sm:mt-24">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-1">
                  Explore More
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                  More Events & News
                </h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:text-[#C9A84C]"
              >
                <span>View All Events</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Lightbox for full size poster view */}
      {event.poster && (
        <Lightbox
          images={[
            {
              image: event.poster,
              alt: `${event.title} poster`,
              caption: event.title,
            },
          ]}
          currentIndex={0}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      {/* 5. CTA Banner */}
      <FinalCtaBanner />
    </div>
  );
}
