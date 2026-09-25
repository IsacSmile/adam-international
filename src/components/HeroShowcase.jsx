import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ArrowRight, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Clean, emotional, aspirational Unsplash image: confident graduate with campus bokeh
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop";

export default function HeroShowcase({ onBookAppointment }) {
  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Initial Load Entrance Timeline
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (bgImgRef.current) {
        loadTl.fromTo(
          bgImgRef.current,
          { scale: 1.08, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.1 }
        );
      }

      loadTl
        .fromTo(badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.7'
        )
        .fromTo(titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.35'
        )
        .fromTo(subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(statsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.2'
        );

      // 2. Parallax Scrub on Background Image for Desktop
      if (bgImgRef.current && !isMobile) {
        gsap.to(bgImgRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handlePrimaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#DFBE7A',
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(201, 168, 76, 0.4)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handlePrimaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#C9A84C',
      scale: 1,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleSecondaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#FFFFFF',
      color: '#0B1F3A',
      borderColor: '#FFFFFF',
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleSecondaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <main id="home" ref={heroRef} className="relative bg-[#0B1F3A] overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND IMAGE WITH HEAVY DEEP NAVY OVERLAY */}
      <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex items-center pt-8 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32 px-4 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={bgImgRef}
            src={HERO_BG_IMAGE}
            alt="Confident international graduate student with diploma on university campus"
            className="w-full h-full object-cover object-center sm:object-top will-change-transform"
          />
          {/* Deep Navy Heavy Gradient Overlay for Maximum Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/92 to-[#0B1F3A]/55 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/40 to-transparent z-10" />
        </div>

        {/* 2. HERO CONTENT CONTAINER */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20">
          <div className="max-w-3xl text-left">
            
            {/* Small Gold Pill Badge (Optimized Mobile Size) */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[#DFBE7A] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 backdrop-blur-md shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
              <span className="truncate">Top-Tier Overseas Education Consultancy</span>
            </div>

            {/* Large Bold Headline */}
            <h1
              ref={titleRef}
              className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-3 sm:mb-6 drop-shadow-md"
            >
              Architect Your Academic Future <br className="hidden sm:inline" />
              With <span className="text-[#C9A84C]">Adam International</span>
            </h1>

            {/* Supporting Paragraph */}
            <p
              ref={subtextRef}
              className="text-xs sm:text-lg lg:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-10 drop-shadow"
            >
              Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
            </p>

            {/* Two Action Buttons (Tightened Mobile Spacing & Enhanced Secondary Button) */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 max-w-md sm:max-w-none"
            >
              {/* Primary Gold CTA */}
              <button
                type="button"
                onClick={onBookAppointment}
                onMouseEnter={handlePrimaryMouseEnter}
                onMouseLeave={handlePrimaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0B1F3A] font-bold text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-xl cursor-pointer transition-all shadow-md text-center"
              >
                <span>Book Free Counseling Session</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A] shrink-0" />
              </button>

              {/* Secondary Button (High Visibility with White Border & Subtle Glass Fill) */}
              <a
                href="#countries"
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-white/12 border border-white/50 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-7 rounded-xl transition-all text-center backdrop-blur-md shadow-sm"
              >
                <span>Explore Top Destinations</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 3. FLOATING STATS CARD (Mobile Optimized 2x2 Grid with Compact Padding) */}
      <div className="relative z-30 max-w-[1120px] mx-auto px-3.5 sm:px-6 -mt-12 sm:-mt-20 pb-10 sm:pb-12">
        <div
          ref={statsRef}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 text-center divide-y-0 sm:divide-x divide-gray-100"
        >
          <div className="p-2 sm:p-0 border-r border-b sm:border-r-0 sm:border-b-0 border-gray-100">
            <div className="text-xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">12,500+</div>
            <div className="text-[11px] sm:text-sm text-gray-500 font-semibold mt-0.5 sm:mt-1">Students Enrolled</div>
          </div>
          <div className="p-2 sm:p-0 border-b sm:border-b-0 border-gray-100">
            <div className="text-xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">98.4%</div>
            <div className="text-[11px] sm:text-sm text-gray-500 font-semibold mt-0.5 sm:mt-1">Visa Success Rate</div>
          </div>
          <div className="p-2 sm:p-0 border-r sm:border-r-0 border-gray-100 pt-3 sm:pt-0">
            <div className="text-xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">450+</div>
            <div className="text-[11px] sm:text-sm text-gray-500 font-semibold mt-0.5 sm:mt-1">Partner Universities</div>
          </div>
          <div className="p-2 sm:p-0 pt-3 sm:pt-0">
            <div className="text-xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">$15M+</div>
            <div className="text-[11px] sm:text-sm text-gray-500 font-semibold mt-0.5 sm:mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </div>

    </main>
  );
}
