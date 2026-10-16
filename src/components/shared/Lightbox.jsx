import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Building2 } from 'lucide-react';
import YouTubeFacade from './YouTubeFacade';
import { countries } from '../../data/countries';

export default function Lightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onIndexChange,
}) {
  const modalRef = useRef(null);

  const hasMultiple = images.length > 1;

  // Handle keyboard navigation: Esc to close, Arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'ArrowLeft' && hasMultiple) {
        e.preventDefault();
        onIndexChange?.((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight' && hasMultiple) {
        e.preventDefault();
        onIndexChange?.((currentIndex + 1) % images.length);
      }
    };

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Focus trap: focus modal container
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, hasMultiple, onClose, onIndexChange]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentItem = images[currentIndex];
  const isObject = typeof currentItem === 'object' && currentItem !== null;
  const imageSrc = isObject ? currentItem.image : currentItem;
  const isVideo = isObject && Boolean(currentItem.video?.id);
  const altText = isObject
    ? currentItem.alt || currentItem.caption || 'Gallery photo'
    : `Gallery photo ${currentIndex + 1} of ${images.length}`;

  const countryObj =
    isObject && currentItem.country
      ? countries.find(
          (c) =>
            c.slug === currentItem.country ||
            c.name.toLowerCase() === currentItem.country?.toLowerCase()
        )
      : null;

  const hasDetails =
    isObject &&
    Boolean(
      currentItem.type ||
      currentItem.studentName ||
      currentItem.caption ||
      currentItem.message ||
      currentItem.university ||
      currentItem.location ||
      currentItem.date
    );

  const handlePrev = (e) => {
    e.stopPropagation();
    onIndexChange?.((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onIndexChange?.((currentIndex + 1) % images.length);
  };

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B1F3A]/90 backdrop-blur-md outline-none animate-fadeIn"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-30"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-30"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-30"
          aria-label="Next item"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center my-auto overflow-y-auto px-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {isVideo ? (
          <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/15 shrink-0">
            <YouTubeFacade videoId={currentItem.video.id} title={altText} />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-0 shrink">
            <img
              src={imageSrc}
              alt={altText}
              className={`${
                hasDetails ? 'max-h-[48vh] sm:max-h-[54vh]' : 'max-h-[78vh] sm:max-h-[82vh]'
              } max-w-full object-contain rounded-2xl shadow-2xl border border-white/15`}
            />
          </div>
        )}

        {/* Details & Caption for rich items */}
        {hasDetails && (
          <div className="shrink-0 mt-3 w-full max-w-2xl bg-[#0B1F3A]/95 border border-white/10 rounded-2xl p-3.5 sm:p-4 text-white text-center sm:text-left space-y-2 shadow-2xl mb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {currentItem.type && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9A84C] text-[#0B1F3A]">
                    {currentItem.type}
                  </span>
                )}
                {currentItem.studentName && (
                  <span className="text-sm font-bold text-white">
                    {currentItem.studentName}
                  </span>
                )}
                {countryObj && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                    <span>{countryObj.flag}</span>
                    <span>{countryObj.name}</span>
                  </span>
                )}
              </div>

              {hasMultiple && (
                <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {currentItem.caption && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {currentItem.caption}
              </p>
            )}

            {currentItem.message && (
              <p className="text-xs sm:text-sm italic text-amber-200/90 leading-relaxed font-normal">
                "{currentItem.message}"
              </p>
            )}

            {(currentItem.university || currentItem.location || currentItem.date) && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1.5 border-t border-white/10">
                {currentItem.university && (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                    <span>{currentItem.university}</span>
                  </span>
                )}
                {currentItem.location && (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                    <span>{currentItem.location}</span>
                  </span>
                )}
                {currentItem.date && (
                  <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                    <span>{currentItem.date}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Counter for simple string images */}
        {!isObject && hasMultiple && (
          <div className="mt-3 text-xs font-semibold text-slate-300 bg-[#0B1F3A]/60 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

