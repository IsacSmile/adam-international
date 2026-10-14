import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { successStories } from '../../../data/successStories';
import { countries } from '../../../data/countries';
import { SHOW_PLACEHOLDERS } from '../../../lib/contentFlags';

function CompactStoryCard({ story }) {
  if (!story) return null;

  const countryObj = countries.find(
    (c) =>
      c.slug === story.country ||
      c.name.toLowerCase() === story.country?.toLowerCase()
  );
  const countryFlag = countryObj ? countryObj.flag : '🌍';

  const initials = story.studentName
    ? story.studentName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'S';

  const isRealAndConsented = !story.isPlaceholder && story.consentOnFile === true;
  const journey = isRealAndConsented && Array.isArray(story.journey) ? story.journey : [];
  const visaMilestone = journey.find(
    (m) =>
      typeof m.label === 'string' &&
      m.label.toLowerCase().includes('visa approved') &&
      typeof m.date === 'string' &&
      m.date.trim().length > 0
  );
  const admissionMilestone = journey.find(
    (m) =>
      typeof m.label === 'string' &&
      (m.label.toLowerCase().includes('admission confirmed') ||
       m.label.toLowerCase().includes('offer received')) &&
      typeof m.date === 'string' &&
      m.date.trim().length > 0
  );

  const milestonePill = visaMilestone ? (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Visa approved
    </span>
  ) : admissionMilestone ? (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
      Admission confirmed
    </span>
  ) : null;

  return (
    <article className="h-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(11,31,58,0.04)] hover:border-[#C9A84C] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] transition-all duration-300 flex flex-col justify-between group relative">
      {story.isPlaceholder && (
        <span className="absolute top-2 left-2 z-10 bg-slate-200 text-slate-700 border border-slate-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider pointer-events-none">
          SAMPLE
        </span>
      )}
      <div>
        {/* Header: Photo/Initials, Name, University, Flag */}
        <div className="flex items-center gap-3.5 mb-4">
          {story.photo ? (
            <img
              src={story.photo}
              alt={story.studentName}
              loading="lazy"
              decoding="async"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0B1F3A] text-[#C9A84C] font-extrabold text-sm flex items-center justify-center border border-slate-200 shrink-0">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A] truncate">
                {story.studentName}
              </h3>
              <span className="text-base leading-none shrink-0" role="img" aria-label={story.country || 'Destination'}>
                {countryFlag}
              </span>
            </div>
            {story.university && (
              <p className="text-xs text-slate-500 font-medium truncate">
                {story.university}
              </p>
            )}
            {(story.course || story.intake) && (
              <p className="text-xs text-slate-400 font-normal truncate mt-0.5">
                {[story.course, story.intake].filter(Boolean).join(' · ')}
              </p>
            )}
            {milestonePill && (
              <div className="mt-1.5">
                {milestonePill}
              </div>
            )}
          </div>
        </div>

        {/* Quote only (max 4 lines) */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed font-normal italic">
          “{story.quote}”
        </p>
      </div>

      {/* Action link */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to={`/success-stories#${story.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors"
        >
          <span>Read their story →</span>
        </Link>
      </div>
    </article>
  );
}

export default function StoryStripSection({
  id,
  heading = 'Student Stories',
  sub,
  tag,
  stories,
  button = { label: 'Read Student Stories', to: '/success-stories' },
}) {
  const baseStories = stories || successStories || [];
  let filteredStories = SHOW_PLACEHOLDERS
    ? baseStories
    : baseStories.filter((s) => !s.isPlaceholder);

  if (!stories && tag === 'training') {
    filteredStories = filteredStories.filter((s) => s.training === true);
  } else if (!stories && typeof tag === 'string') {
    filteredStories = filteredStories.filter(
      (s) =>
        s.country?.toLowerCase() === tag.toLowerCase() ||
        s.country?.toLowerCase() === tag.toLowerCase().replace(/-/g, ' ')
    );
  }

  // If filtered stories are empty, hide the section
  if (filteredStories.length === 0) {
    return null;
  }

  const displayStories = filteredStories.slice(0, 3);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                {heading}
              </h2>
            )}
            {sub && (
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {sub}
              </p>
            )}
          </div>

          {button?.to && (
            <Link
              to={button.to}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
            >
              <span>{button.label || 'Read Student Stories'}</span>
            </Link>
          )}
        </div>

        {/* Stories Grid: 3 per row on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayStories.map((story) => (
            <CompactStoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Mobile View All Button */}
        {button?.to && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              to={button.to}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold w-full"
            >
              <span>{button.label || 'Read Student Stories'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
