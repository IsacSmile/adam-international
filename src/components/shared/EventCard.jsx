import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { getEventDateLabel, getEventStatus } from '../../lib/events';
import { countries } from '../../data/countries';

export default function EventCard({ event }) {
  if (!event) return null;

  const status = getEventStatus(event);
  const isUpcoming = status === 'upcoming';
  const isAward = event.type === 'award';
  const countryObj = event.country
    ? countries.find((c) => c.slug.toLowerCase() === event.country.toLowerCase())
    : null;
  const flag = countryObj?.flag || '';
  const dateLabel = getEventDateLabel(event);

  return (
    <article className="group h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      <div>
        {/* Poster Image Container (poster aspect ratio, object-contain, light navy/neutral background) */}
        <div className="relative aspect-[1024/765] w-full overflow-hidden bg-[#0B1F3A]/5 border-b border-slate-100 flex items-center justify-center">
          <img
            src={event.poster || event.photo || event.image}
            alt={`${event.title} poster`}
            width={event.posterWidth || 1024}
            height={event.posterHeight || 765}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {/* Badges & Flag */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                  isAward
                    ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                    : 'bg-blue-50 text-[#0B1F3A] border border-blue-200/80'
                }`}
              >
                {isAward ? 'Achievement' : 'Spot Admission'}
              </span>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isUpcoming
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isUpcoming ? 'Upcoming' : 'Past event'}
              </span>
            </div>

            {flag && (
              <span className="text-xl leading-none" role="img" aria-label={countryObj?.name}>
                {flag}
              </span>
            )}
          </div>

          {/* Event Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Info Line: Date & Location (only if location exists) */}
          <div className="space-y-1 text-xs text-slate-600">
            {dateLabel && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <span className="font-semibold text-slate-700">{dateLabel}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Summary clamped to 3 lines */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {event.summary}
          </p>

          {/* Highlight & Condition note (spot admissions only) */}
          {event.highlight && (
            <div className="pt-3 border-t border-slate-100">
              <div className="bg-[#FAF7F2] border border-[#C9A84C]/30 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#0B1F3A] leading-snug">
                      {event.highlight}
                    </p>
                    {event.conditionNote && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
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

      {/* Action Buttons footer */}
      <div className="p-5 sm:p-6 pt-0 mt-auto border-t border-slate-100/80">
        <div className="pt-4 flex flex-wrap items-center gap-2.5">
          {isUpcoming && !isAward ? (
            <>
              <Link
                to={`/events/${event.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0B1F3A] text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:bg-slate-50 transition-all text-center"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
              </Link>
              <Link
                to={`/events/${event.slug}#register`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-xs sm:text-sm font-semibold text-[#C9A84C] transition-all shadow-sm hover:shadow text-center"
              >
                <span>Register Interest</span>
              </Link>
            </>
          ) : (
            <Link
              to={`/events/${event.slug}`}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-xs sm:text-sm font-semibold text-[#C9A84C] transition-all shadow-sm hover:shadow text-center"
            >
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
