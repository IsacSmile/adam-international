import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ArrowRight, ArrowUpRight, GraduationCap, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Unsplash high-resolution cinematic campus & students image
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop";

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

      // Background image scale reveal
      if (bgImgRef.current) {
        loadTl.fromTo(
          bgImgRef.current,
          { scale: 1.1, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.2 }
        );
      }

      // Text elements stagger fade + rise
      loadTl
        .fromTo(badgeRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.8'
        )
        .fromTo(titleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(subtextRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(buttonsRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(statsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.3'
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

  // Primary Button Hover Animation
  const handlePrimaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#DFBE7A',
      scale: 1.03,
      boxShadow: '0 10px 30px rgba(201, 168, 76, 0.4)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handlePrimaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#C9A84C',
      scale: 1,
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  // Secondary Button Hover Animation
  const handleSecondaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#FFFFFF',
      color: '#0B1F3A',
      borderColor: '#FFFFFF',
      scale: 1.03,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleSecondaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <main id="home" ref={heroRef} className="relative bg-[#0B1F3A] overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center pt-12 pb-24 lg:pt-16 lg:pb-32 px-5 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={bgImgRef}
            src={HERO_BG_IMAGE}
            alt="International students walking on a prestigious university campus"
            className="w-full h-full object-cover object-center will-change-transform"
          />
          {/* Deep Navy Dual Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/90 to-[#0B1F3A]/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent z-10 opacity-90" />
        </div>

        {/* 2. HERO CONTENT CONTAINER (Left-Aligned on Desktop, Center-Left on Mobile) */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20">
          <div className="max-w-3xl text-left">
            
            {/* Small Gold Pill Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm"
            >
              <Award className="w-4 h-4 text-[#C9A84C]" />
              <span>Top-Tier Overseas Education Consultancy</span>
            </div>

            {/* Large Bold Headline */}
            <h1
              ref={titleRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-md"
            >
              Architect Your Academic Future <br className="hidden sm:inline" />
              With <span className="text-[#C9A84C]">Adam International</span>
            </h1>

            {/* Supporting Paragraph */}
            <p
              ref={subtextRef}
              className="text-base sm:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl mb-10 drop-shadow"
            >
              Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
            </p>

            {/* Two Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md sm:max-w-none"
            >
              {/* Primary Gold CTA */}
              <button
                type="button"
                onClick={onBookAppointment}
                onMouseEnter={handlePrimaryMouseEnter}
                onMouseLeave={handlePrimaryMouseLeave}
                className="inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] text-[#0B1F3A] font-bold text-base py-4 px-8 rounded-xl cursor-pointer transition-all shadow-lg text-center"
              >
                <span>Book Free Counseling Session</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
              </button>

              {/* Secondary Outline CTA */}
              <a
                href="#countries"
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
                className="inline-flex items-center justify-center gap-2.5 bg-transparent border border-white/40 text-white font-medium text-base py-4 px-7 rounded-xl transition-all text-center backdrop-blur-sm"
              >
                <span>Explore Top Destinations</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 3. FLOATING STATS BAR OVERLAPPING HERO IMAGE (Zero Gap & Perfectly Positioned) */}
      <div className="relative z-30 max-w-[1120px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 pb-12">
        <div
          ref={statsRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
        >
          <div className="pt-2 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">12,500+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Students Enrolled</div>
          </div>
          <div className="pt-2 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">98.4%</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Visa Success Rate</div>
          </div>
          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">450+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Partner Universities</div>
          </div>
          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">$15M+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </div>

    </main>
  );
}
