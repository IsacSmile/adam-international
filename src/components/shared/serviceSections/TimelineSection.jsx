import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TimelineSection({
  id,
  eyebrow,
  heading,
  sub,
  steps = [],
}) {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);
  const desktopScrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

  const addStepRef = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  useEffect(() => {
    const el = desktopScrollRef.current;
    if (!el || steps.length < 7) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setScrollState({
        canScrollLeft: scrollLeft > 8,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 8,
      });
    };

    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [steps.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || stepsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepsRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-2">
                {eyebrow}
              </span>
            )}
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

          {/* Desktop Navigation Arrows (shown only when 7+ steps require horizontal scrolling) */}
          {steps.length >= 7 && (
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (desktopScrollRef.current) {
                    desktopScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
                  }
                }}
                aria-label="Previous step"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (desktopScrollRef.current) {
                    desktopScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
                  }
                }}
                aria-label="Next step"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            DESKTOP HORIZONTAL TIMELINE (≥1024px)
            - Up to 6 steps fit in ONE row with NO scrollbar (minmax(0, 1fr)).
            - 7+ steps allow inner scroll with soft edge fades and hidden native scrollbar.
        ========================================================================= */}
        <div className="hidden lg:block relative">
          {/* Soft edge fades when scrolling is active */}
          {steps.length >= 7 && (
            <>
              <div
                className={`pointer-events-none absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-20 transition-opacity duration-300 ${
                  scrollState.canScrollLeft ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div
                className={`pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-20 transition-opacity duration-300 ${
                  scrollState.canScrollRight ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          )}

          <div
            ref={desktopScrollRef}
            className={
              steps.length >= 7
                ? 'overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                : 'overflow-visible pb-2 pt-2'
            }
          >
            <div
              className={`grid relative ${steps.length >= 6 ? 'gap-3.5 xl:gap-4' : 'gap-5 sm:gap-6'}`}
              style={{
                gridTemplateColumns:
                  steps.length >= 7
                    ? `repeat(${steps.length}, minmax(185px, 1fr))`
                    : `repeat(${steps.length}, minmax(0, 1fr))`,
                minWidth: steps.length >= 7 ? `${steps.length * 195}px` : '100%',
                width: '100%',
              }}
            >
              {steps.map((step, idx) => {
                const stepNumber = String(idx + 1).padStart(2, '0');
                const linkTo = typeof step.link === 'string' ? step.link : step.link?.to;
                const linkPrefix = linkTo && !linkTo.startsWith('/') && !linkTo.startsWith('http') ? `/services/${linkTo}` : linkTo;

                // Dynamically adjust padding and text sizing for 6+ items so they fit cleanly
                const isDense = steps.length >= 6;

                const CardContent = (
                  <div
                    className={`h-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(11,31,58,0.04)] flex flex-col justify-between transition-all duration-300 relative ${
                      isDense ? 'p-3.5 xl:p-4' : 'p-5 sm:p-6'
                    } ${
                      linkPrefix ? 'group-hover:border-[#C9A84C] group-hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] cursor-pointer' : ''
                    }`}
                  >
                    <div>
                      <h3
                        className={`font-bold text-[#0B1F3A] mb-1.5 leading-snug group-hover:text-[#C9A84C] transition-colors ${
                          isDense ? 'text-xs xl:text-sm' : 'text-base'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p
                        className={`text-slate-600 leading-relaxed font-normal ${
                          isDense ? 'text-[11px] xl:text-xs' : 'text-xs sm:text-sm'
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>

                    {linkPrefix && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] xl:text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C]">
                        <span>Learn more</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                );

                return (
                  <div
                    key={idx}
                    ref={addStepRef}
                    className={`flex flex-col relative h-full group ${steps.length >= 7 ? 'snap-start' : ''}`}
                  >
                    {/* Step Number Badge & Connecting Line */}
                    <div className="relative flex items-center mb-4">
                      {idx < steps.length - 1 && (
                        <div
                          className="absolute top-1/2 left-4 h-[2px] bg-slate-200 z-0 pointer-events-none"
                          style={{ width: isDense ? 'calc(100% + 1rem)' : 'calc(100% + 1.5rem)' }}
                        />
                      )}
                      <div
                        className={`relative z-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center font-extrabold shadow-xs group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors border-2 border-slate-50 ${
                          isDense ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
                        }`}
                      >
                        {stepNumber}
                      </div>
                    </div>

                    {/* Card */}
                    {linkPrefix ? (
                      <Link to={linkPrefix} className="flex-1 block h-full">
                        {CardContent}
                      </Link>
                    ) : (
                      <div className="flex-1 block h-full">
                        {CardContent}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE VERTICAL TIMELINE (<1024px)
        ========================================================================= */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => {
            const stepNumber = String(idx + 1).padStart(2, '0');
            const linkTo = typeof step.link === 'string' ? step.link : step.link?.to;
            const linkPrefix = linkTo && !linkTo.startsWith('/') && !linkTo.startsWith('http') ? `/services/${linkTo}` : linkTo;

            const CardContent = (
              <div
                className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative transition-all ${
                  linkPrefix ? 'hover:border-[#C9A84C] cursor-pointer' : ''
                }`}
              >
                {/* Connecting Pin */}
                <div className="absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0B1F3A] text-[#C9A84C] text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
                  {stepNumber}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A] leading-snug mb-1">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.text}
                </p>

                {linkPrefix && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );

            return linkPrefix ? (
              <Link key={idx} to={linkPrefix} className="block relative">
                {CardContent}
              </Link>
            ) : (
              <div key={idx} className="relative">
                {CardContent}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
