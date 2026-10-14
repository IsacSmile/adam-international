import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const currentImage = images[currentIndex];

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B1F3A]/85 backdrop-blur-md outline-none animate-fadeIn"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image Content Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
      >
        <img
          src={currentImage}
          alt={`Gallery photo ${currentIndex + 1} of ${images.length}`}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/15"
        />

        {/* Counter */}
        {hasMultiple && (
          <div className="mt-3 text-xs font-semibold text-slate-300 bg-[#0B1F3A]/60 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
