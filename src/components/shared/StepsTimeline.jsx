import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StepsTimeline({ steps = [] }) {
  const containerRef = useRef(null);
  const stepItemsRef = useRef([]);

  const addStepRef = (el) => {
    if (el && !stepItemsRef.current.includes(el)) {
      stepItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (!steps || steps.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion && stepItemsRef.current.length > 0) {
        gsap.fromTo(
          stepItemsRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [steps]);

  if (!steps || steps.length === 0) return null;

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto py-4">
      {/* Vertical Continuous Line */}
      <div className="absolute left-5 sm:left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#C9A84C] via-[#0B1F3A]/20 to-transparent" />

      <div className="space-y-8 sm:space-y-10 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            ref={addStepRef}
            className="flex items-start gap-4 sm:gap-6 group"
          >
            {/* Number Pill / Node */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B1F3A] text-[#C9A84C] border-2 border-[#C9A84C] flex items-center justify-center font-extrabold text-sm sm:text-base shrink-0 shadow-md group-hover:scale-105 group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-all duration-300">
              {idx + 1}
            </div>

            {/* Step Content Card */}
            <div className="flex-1 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_16px_rgba(11,31,58,0.04)] hover:shadow-md hover:border-[#C9A84C]/50 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] mb-1.5 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
