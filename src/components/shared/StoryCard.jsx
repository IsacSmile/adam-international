import React, { useState } from 'react';
import { Award, Sparkles, MapPin, Quote, ChevronDown, ChevronUp, CheckCircle2, Calendar } from 'lucide-react';
import { countries } from '../../data/countries';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * StoryCard component used in SuccessStoriesPage and UniversityDetailPage.
 * Displays photo, name, university, course, intake, country, pull-quote,
 * expandable story paragraphs, journey timeline, and photo gallery.
 */
export default function StoryCard({ story, onImageClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!story) return null;

  const countryObj = countries.find((c) => c.slug === story.country);
  const initials = getInitials(story.studentName);
  const storyParagraphs = story.story || [];
  const hasMultipleParagraphs = storyParagraphs.length > 2;
  const displayedParagraphs = isExpanded || !hasMultipleParagraphs 
    ? storyParagraphs 
    : storyParagraphs.slice(0, 2);

  return (
    <article
      id={story.id}
      className="relative bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow scroll-mt-28"
    >
      {/* Header: Student Info & Photo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B1F3A] text-white font-bold text-lg sm:text-2xl flex items-center justify-center shrink-0 border-2 border-gray-100 shadow-sm overflow-hidden">
            {story.photo ? (
              <img
                src={story.photo}
                alt={story.studentName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
                {story.studentName}
              </h3>
              {countryObj && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                  <span>{countryObj.flag}</span>
                  <span>{countryObj.name}</span>
                </span>
              )}
            </div>

            <div className="space-y-0.5 text-xs sm:text-sm text-gray-600">
              {story.university && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>{story.university}</span>
                </div>
              )}
              {story.course && (
                <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>{story.course}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {story.intake && (
          <div className="sm:self-center inline-flex items-center gap-1.5 bg-[#0B1F3A]/5 text-[#0B1F3A] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#0B1F3A]/10">
            <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Intake: {story.intake}</span>
          </div>
        )}
      </div>

      {/* Pull Quote */}
      {story.quote && (
        <div className="my-6 relative pl-6 border-l-4 border-[#C9A84C]">
          <Quote className="absolute -top-2 left-0 w-4 h-4 text-[#C9A84C]/40 -translate-x-full" />
          <p className="text-base sm:text-lg text-gray-800 italic font-medium leading-relaxed">
            "{story.quote}"
          </p>
        </div>
      )}

      {/* Story Paragraphs */}
      {storyParagraphs.length > 0 && (
        <div className="my-6 space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {displayedParagraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}

          {hasMultipleParagraphs && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors pt-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Show less' : 'Read the full story'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}

      {/* Journey Mini Timeline */}
      {story.journey && story.journey.length > 0 && (
        <div className="my-6 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Application Journey
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {story.journey.map((step, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100 relative"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B1F3A] mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{step.label}</span>
                </div>
                {step.date && (
                  <p className="text-[11px] text-gray-500 pl-5">{step.date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {story.gallery && story.gallery.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {story.gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onImageClick && onImageClick(story.gallery, idx)}
                className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group relative block focus:outline-none focus:ring-2 focus:ring-[#C9A84C] cursor-pointer"
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`${story.studentName} gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
