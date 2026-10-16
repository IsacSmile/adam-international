import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { getUpcomingEvents, getEventDateLabel } from '../../lib/events';
import { countries } from '../../data/countries';

export default function HomeUpcomingEventsStrip() {
  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents().slice(0, 3);
  }, []);

  // Hide the strip if there are no upcoming events
  if (!upcomingEvents || upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full bg-[#FAF7F2] py-12 sm:py-16 border-t border-slate-200/70"
      aria-labelledby="homepage-upcoming-events-title"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#0B1F3A] border border-[#C9A84C]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              <span>Upcoming Spot Admissions</span>
            </div>
            <h2
              id="homepage-upcoming-events-title"
              className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight"
            >
              Meet European University Representatives
            </h2>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Up to 3 event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingEvents.map((event) => {
            const countryObj = event.country
              ? countries.find((c) => c.slug.toLowerCase() === event.country.toLowerCase())
              : null;
            const flag = countryObj?.flag || '';
            const dateLabel = getEventDateLabel(event);

            return (
              <div
                key={event.slug}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#C9A84C]/60 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Poster Image Container */}
                  {event.poster && (
                    <div className="relative aspect-[1024/765] w-full overflow-hidden bg-[#0B1F3A]/5 border-b border-slate-100 flex items-center justify-center">
                      <img
                        src={event.poster}
                        alt={`${event.title} poster`}
                        width={event.posterWidth || 1024}
                        height={event.posterHeight || 765}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6 pb-2">
                    {/* Top line: Flag & Date label */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        {flag && <span className="text-xl leading-none">{flag}</span>}
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {countryObj?.name || 'Spot Admission'}
                        </span>
                      </div>

                    {dateLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                        <Calendar className="w-3 h-3 text-[#C9A84C]" />
                        <span>{dateLabel}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base sm:text-lg text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Highlight & condition note */}
                  {event.highlight && (
                    <div className="mb-4">
                      <div className="bg-[#FAF7F2] border border-[#C9A84C]/30 rounded-xl p-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#0B1F3A] leading-snug">
                              {event.highlight}
                            </p>
                            {event.conditionNote && (
                              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-snug">
                                *{event.conditionNote}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-5 sm:p-6 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to={`/events/${event.slug}#register`}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#0B1F3A] hover:bg-[#132A4A] text-[#C9A84C] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
