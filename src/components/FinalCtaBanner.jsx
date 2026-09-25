import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Phone, MessageSquare, Sparkles, Clock, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCtaBanner({ onBookCounseling }) {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const trustPillsRef = useRef(null);
  const buttonsRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          trustPillsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          callRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      className="w-full bg-[#0B1F3A] py-12 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto relative z-10">
        
        {/* ELEVATED GLASSMORPHIC CONTAINER CARD */}
        <div
          ref={cardRef}
          className="relative bg-gradient-to-br from-[#0D2647] via-[#0B1F3A] to-[#071527] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] p-6 sm:p-12 lg:p-16 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden text-center"
        >
          {/* Ambient Decorative Background Glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 sm:w-96 sm:h-96 bg-[#C9A84C]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-96 sm:h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            {/* 1. TOP BADGE PILL */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-extrabold tracking-wider uppercase backdrop-blur-md shadow-sm mb-5 sm:mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
              <span>START YOUR GLOBAL JOURNEY</span>
            </div>

            {/* 2. MAIN HEADLINE */}
            <h2
              ref={titleRef}
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18] mb-4 sm:mb-5"
            >
              Ready to Architect Your{' '}
              <span className="text-[#C9A84C] relative inline-block">
                Academic Future?
              </span>
            </h2>

            {/* 3. SUBTEXT */}
            <p
              ref={subtextRef}
              className="text-xs sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto"
            >
              Book a free counseling session with our senior overseas education advisors and take the first confident step toward your dream university.
            </p>

            {/* 4. MOBILE-FIRST TRUST PILLS STRIP */}
            <div
              ref={trustPillsRef}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 text-[11px] sm:text-xs font-bold text-gray-200"
            >
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>15-Min Free Session</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                <GraduationCap className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>450+ Partner Universities</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Visa Guidance</span>
              </div>
            </div>

            {/* 5. MOBILE-FIRST ACTION BUTTONS */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mb-8"
            >
              {/* Primary Call to Action Button */}
              <button
                type="button"
                onClick={onBookCounseling}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-white text-[#0B1F3A] font-extrabold text-base sm:text-lg py-4 px-8 sm:px-9 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 group border border-[#C9A84C]"
              >
                <span>Book Free Counseling</span>
                <ArrowRight className="w-5 h-5 text-[#0B1F3A] group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              {/* Secondary WhatsApp Button */}
              <a
                href="https://wa.me/919895890500"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500/15 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-white font-extrabold text-base sm:text-lg py-4 px-8 rounded-2xl transition-all duration-300 shadow-md active:scale-95 backdrop-blur-md group"
              >
                <MessageSquare className="w-5 h-5 fill-current text-emerald-400 group-hover:text-white transition-colors" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* 6. DIRECT PHONE NUMBER CLICK-TO-CALL */}
            <div
              ref={callRef}
              className="text-slate-400 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 pt-2 border-t border-white/10 max-w-md mx-auto"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
              <span>
                Or call us directly at{' '}
                <a
                  href="tel:+919895890500"
                  className="text-white hover:text-[#C9A84C] font-extrabold underline underline-offset-4 transition-colors"
                >
                  +91 9895 890 500
                </a>
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

