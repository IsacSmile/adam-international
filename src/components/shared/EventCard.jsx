import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { getEventDateLabel, getEventStatus, isRegistrationOpen } from '../../lib/events';
import { countries } from '../../data/countries';
import { useAppointment } from '../../context/AppointmentContext';

export default function EventCard({ event }) {
  const appointmentCtx = useAppointment();
  const openAppointment = appointmentCtx?.openAppointment;

  if (!event) return null;

  const status = getEventStatus(event);
  const isUpcoming = status === 'upcoming';
  const isPast = status === 'past';
  const isAward = event.type === 'award';
  const countryObj = event.country
    ? countries.find((c) => c.slug.toLowerCase() === event.country.toLowerCase())
    : null;
  const flag = countryObj?.flag || '';
  const dateLabel = getEventDateLabel(event);

  // Lazy-load, use the thumbnail (poster_thumb / image_thumb) in cards, full image only on EventDetailPage
  const posterSrc =
    event.posterThumb ||
    event.poster_thumb ||
    event.imageThumb ||
    event.image_thumb ||
    event.poster ||
    event.image ||
    event.photo;

  return (
    <article className="group h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      <div>
        {/* Poster Image Container: fixed aspect-[4/3], object-contain, background #0B1F3A */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B1F3A] border-b border-slate-100 flex items-center justify-center">
          {posterSrc && (
            <img
              src={posterSrc}
              alt={`${event.title} poster`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Content body: padding p-5 */}
        <div className="p-5 space-y-3">
          {/* Badges & Flag: aligned */}
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
              <span className="text-xl leading-none shrink-0" role="img" aria-label={countryObj?.name}>
                {flag}
              </span>
            )}
          </div>

          {/* Event Title: text-lg, line-clamp-2 */}
          <h3 className="text-lg font-bold text-[#0B1F3A] leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Info Line: Date and location stay on one line each */}
          <div className="space-y-1 text-xs text-slate-600">
            {dateLabel && (
              <div className="flex items-center gap-2 truncate">
                <Calendar className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <span className="font-semibold text-slate-700 truncate">{dateLabel}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Summary: text-sm, line-clamp-2 */}
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {event.summary}
          </p>

          {/* Highlight box: compact (smaller padding, text-sm, condition note text-xs) */}
          {event.highlight && (
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-[#FAF7F2] border border-[#C9A84C]/30 rounded-xl p-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#0B1F3A] leading-snug">
                      {event.highlight}
                    </p>
                    {event.conditionNote && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
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

      {/* Action Buttons footer: padding p-5 pt-0, mt-auto */}
      <div className="p-5 pt-0 mt-auto border-t border-slate-100/80">
        <div className="pt-3">
          {isRegistrationOpen(event) ? (
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-2">
              <Link
                to={`/events/${event.slug}`}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-[#0B1F3A] text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:bg-slate-50 transition-all text-center"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
              </Link>
              <Link
                to={`/events/${event.slug}#register`}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-xs sm:text-sm font-semibold text-[#C9A84C] transition-all shadow-xs hover:shadow text-center"
              >
                <span>Register Interest</span>
              </Link>
            </div>
          ) : isUpcoming && !isAward ? (
            <div className="w-full space-y-2">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => openAppointment?.({ country: event.country })}
                  className="text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] underline underline-offset-2 transition-colors cursor-pointer py-1"
                >
                  Registration not open yet — talk to an advisor
                </button>
              </div>
              <Link
                to={`/events/${event.slug}`}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0B1F3A] text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:bg-slate-50 transition-all text-center"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
              </Link>
            </div>
          ) : isPast && !isAward ? (
            <div className="w-full space-y-2">
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-500 block py-1">
                  Registration closed
                </span>
              </div>
              <Link
                to={`/events/${event.slug}`}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0B1F3A] text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:bg-slate-50 transition-all text-center"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C]" />
              </Link>
            </div>
          ) : (
            <Link
              to={`/events/${event.slug}`}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132A4A] text-xs sm:text-sm font-semibold text-[#C9A84C] transition-all shadow-xs hover:shadow text-center"
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
