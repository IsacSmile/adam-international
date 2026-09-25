import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Stunning, high-resolution Unsplash image of happy international students on a university campus
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop";

export default function HeroShowcase({ onBookAppointment }) {
  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const floatingBadge1Ref = useRef(null);
  const floatingBadge2Ref = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Entrance Animations
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (bgImgRef.current) {
        loadTl.fromTo(
          bgImgRef.current,
          { scale: 1.1, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 1.2 }
        );
      }

      loadTl
        .fromTo(badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.8'
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
        .fromTo([floatingBadge1Ref.current, floatingBadge2Ref.current],
          { opacity: 0, scale: 0.85, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15 },
          '-=0.3'
        )
        .fromTo(statsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.2'
        );

      // 2. Parallax Scrub on Background Image for Desktop
      if (bgImgRef.current && !isMobile) {
        gsap.to(bgImgRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 3. Floating badges subtle idle floating animation
      if (!isMobile) {
        gsap.to(floatingBadge1Ref.current, {
          y: -8,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.easeInOut',
        });
        gsap.to(floatingBadge2Ref.current, {
          y: 8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.easeInOut',
          delay: 0.5,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handlePrimaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#DFBE7A',
      scale: 1.03,
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
      scale: 1.03,
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
      
      {/* 1. CINEMATIC HERO SECTION WITH VIBRANT VISIBLE BACKGROUND IMAGE */}
      <div className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[700px] flex items-center pt-10 pb-24 lg:pt-16 lg:pb-32 px-5 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Background Image & Balanced Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={bgImgRef}
            src={HERO_BG_IMAGE}
            alt="International students walking on a vibrant university campus"
            className="w-full h-full object-cover object-center lg:object-right-top will-change-transform brightness-[0.9] contrast-[1.05]"
          />
          
          {/* Left Gradient Overlay: Solid Dark Navy on Left for Text, Clear Transparency on Right for Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/85 sm:via-[#0B1F3A]/75 to-transparent z-10" />
          {/* Bottom Gradient Overlay for Smooth Transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent z-10 opacity-80" />
        </div>

        {/* 2. HERO CONTENT GRID (Left Content + Right Floating Graphic Badges) */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 text-left">
            
            {/* Gold Pill Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md shadow-sm"
            >
              <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Top-Tier Overseas Education Consultancy</span>
            </div>

            {/* Large Bold Headline */}
            <h1
              ref={titleRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-lg"
            >
              Architect Your Academic Future <br className="hidden sm:inline" />
              With <span className="text-[#C9A84C]">Adam International</span>
            </h1>

            {/* Supporting Paragraph */}
            <p
              ref={subtextRef}
              className="text-sm sm:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed max-w-xl mb-8 sm:mb-10 drop-shadow"
            >
              Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
            </p>

            {/* Two Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none"
            >
              {/* Primary Gold CTA */}
              <button
                type="button"
                onClick={onBookAppointment}
                onMouseEnter={handlePrimaryMouseEnter}
                onMouseLeave={handlePrimaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0B1F3A] font-bold text-sm sm:text-base py-3.5 sm:py-4 px-7 sm:px-8 rounded-xl cursor-pointer transition-all shadow-xl text-center"
              >
                <span>Book Free Counseling Session</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A] shrink-0" />
              </button>

              {/* Secondary Outline CTA */}
              <a
                href="#countries"
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/50 text-white font-medium text-sm sm:text-base py-3.5 sm:py-4 px-6 sm:px-7 rounded-xl transition-all text-center backdrop-blur-md shadow-sm"
              >
                <span>Explore Top Destinations</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: FLOATING GLASS CARDS OVER VISIBLE IMAGE (DESKTOP ONLY) */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col gap-6 items-end justify-center pointer-events-none pr-4">
            
            {/* Floating Card 1: Visa Approval Rate */}
            <div
              ref={floatingBadge1Ref}
              className="bg-[#0B1F3A]/80 backdrop-blur-md border border-[#C9A84C]/40 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[280px] pointer-events-auto transform hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">98.4%</div>
                <div className="text-xs text-gray-300 font-medium">Visa Approval Rate</div>
              </div>
            </div>

            {/* Floating Card 2: Partner Universities */}
            <div
              ref={floatingBadge2Ref}
              className="bg-[#0B1F3A]/80 backdrop-blur-md border border-white/20 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[280px] mr-10 pointer-events-auto transform hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 text-[#C9A84C] flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6 text-[#DFBE7A]" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">450+ Universities</div>
                <div className="text-xs text-gray-300 font-medium">UK, USA, EU, Canada</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. FLOATING STATS CARD OVERLAPPING HERO IMAGE */}
      <div className="relative z-30 max-w-[1120px] mx-auto px-4 sm:px-6 -mt-12 sm:-mt-20 pb-12">
        <div
          ref={statsRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center divide-y-0 sm:divide-x divide-gray-100"
        >
          <div className="p-2 sm:p-0 border-r border-b sm:border-r-0 sm:border-b-0 border-gray-100">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">12,500+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Students Enrolled</div>
          </div>
          <div className="p-2 sm:p-0 border-b sm:border-b-0 border-gray-100">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">98.4%</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Visa Success Rate</div>
          </div>
          <div className="p-2 sm:p-0 border-r sm:border-r-0 border-gray-100 pt-3 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">450+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Partner Universities</div>
          </div>
          <div className="p-2 sm:p-0 pt-3 sm:pt-0">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">$15M+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </div>

    </main>
  );
}
