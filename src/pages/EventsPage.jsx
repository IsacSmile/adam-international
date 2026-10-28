import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/shared/PageHero';
import EventCard from '../components/shared/EventCard';
import FinalCtaBanner from '../components/FinalCtaBanner';
import { useAppointment } from '../context/AppointmentContext';
import { getUpcomingEvents, getPastEvents } from '../lib/events';
import { useEvents, ContentError, EventCardSkeleton } from '../hooks/useContent';
import { Calendar, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const { openAppointment } = useAppointment();
  const { data: eventsList, loading, error, refresh } = useEvents();

  const upcomingEvents = useMemo(() => getUpcomingEvents(eventsList), [eventsList]);
  const pastEvents = useMemo(() => getPastEvents(eventsList), [eventsList]);

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      <Helmet>
        <title>Spot Admission Events &amp; Seminars | Adam International</title>
        <meta
          name="description"
          content="Upcoming European university spot admission days, education fairs, webinars, and seminars organized by Adam International Kochi."
        />
        <link rel="canonical" href="https://www.adaminternational.in/events" />
        <meta property="og:title" content="Spot Admission Events &amp; Education Fairs | Adam International" />
        <meta
          property="og:description"
          content="Meet university delegates, get on-the-spot admission evaluations, and attend seminars by Adam International."
        />
        <meta property="og:url" content="https://www.adaminternational.in/events" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* 4.1 Hero */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Events', active: true },
        ]}
        title="Events & News"
        subtitle="Spot admission events, achievements and updates from Adam International."
      />

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {error ? (
          <ContentError onRetry={refresh} />
        ) : (
          <>
            {/* Section 1: Upcoming Events */}
            <section aria-labelledby="upcoming-events-heading">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-1">
                    Opportunities
                  </span>
                  <h2
                    id="upcoming-events-heading"
                    className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]"
                  >
                    Upcoming Events
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.slug} event={event} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] mb-2">
                    New events will be announced soon.
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Talk to an advisor about upcoming spot admissions.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAppointment()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-sm font-semibold text-[#C9A84C] transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Book a Free Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>

            {/* Section 2: Recent News & Achievements (hide if empty or loading) */}
            {!loading && pastEvents.length > 0 && (
              <section aria-labelledby="recent-events-heading">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-1">
                      Milestones
                    </span>
                    <h2
                      id="recent-events-heading"
                      className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]"
                    >
                      Recent News & Achievements
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.slug} event={event} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <FinalCtaBanner />
    </div>
  );
}
