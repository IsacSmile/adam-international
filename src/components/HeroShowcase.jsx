import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  GraduationCap 
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Bright, inspiring, high-resolution Unsplash image of a proud graduate on a sunlit campus
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop";

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

  // Counter Refs for GSAP Count-Up Animation
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const stat4Ref = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Entrance Animations
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (bgImgRef.current) {
        loadTl.fromTo(
          bgImgRef.current,
          { scale: 1.08, opacity: 0.8 },
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

      // 2. GSAP COUNT-UP ANIMATION FOR METRIC NUMBERS FROM ZERO
      const count1Obj = { val: 0 };
      const count2Obj = { val: 0 };
      const count3Obj = { val: 0 };
      const count4Obj = { val: 0 };

      // Metric 1: Students Enrolled (0 -> 12,500+)
      gsap.to(count1Obj, {
        val: 12500,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          if (stat1Ref.current) {
            stat1Ref.current.innerText = Math.floor(count1Obj.val).toLocaleString() + '+';
          }
        },
      });

      // Metric 2: Visa Success Rate (0.0% -> 98.4%)
      gsap.to(count2Obj, {
        val: 98.4,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          if (stat2Ref.current) {
            stat2Ref.current.innerText = count2Obj.val.toFixed(1) + '%';
          }
        },
      });

      // Metric 3: Partner Universities (0 -> 450+)
      gsap.to(count3Obj, {
        val: 450,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          if (stat3Ref.current) {
            stat3Ref.current.innerText = Math.floor(count3Obj.val) + '+';
          }
        },
      });

      // Metric 4: Scholarships Awarded ($0M+ -> $15M+)
      gsap.to(count4Obj, {
        val: 15,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          if (stat4Ref.current) {
            stat4Ref.current.innerText = '$' + Math.floor(count4Obj.val) + 'M+';
          }
        },
      });

      // 3. Parallax Scrub on Background Image for Desktop
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

      // 4. Floating badges subtle idle floating animation
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
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <main id="home" ref={heroRef} className="relative bg-[#0B1F3A] overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center pt-16 sm:pt-20 lg:pt-24 pb-24 lg:pb-32 px-5 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Background Image & Balanced Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={bgImgRef}
            src={HERO_BG_IMAGE}
            alt="Proud international graduate student on campus"
            className="w-full h-full object-cover object-center lg:object-right-top will-change-transform brightness-[1.02] contrast-[1.02]"
          />
          
          {/* Directional left-to-right gradient overlay keeping image crisp on right side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/85 sm:via-[#0B1F3A]/65 via-50% to-transparent z-10" />
          
          {/* Subtle bottom edge gradient to transition into stats section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1F3A] to-transparent z-10 pointer-events-none" />
          
          {/* Subtle top edge gradient for navbar contrast */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B1F3A]/70 to-transparent z-10 pointer-events-none" />
        </div>

        {/* 2. HERO CONTENT GRID */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 text-left">
            
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm"
            >
              <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Top-Tier Overseas Education Consultancy</span>
            </div>

            <h1
              ref={titleRef}
              className="text-[21px] xs:text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-6xl font-extrabold text-white tracking-tight leading-[1.14] mb-6 drop-shadow-lg"
            >
              <span className="block whitespace-nowrap">Architect Your Academic Future</span>
              <span className="block mt-1">
                With <span className="text-[#C9A84C]">Adam International</span>
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-sm sm:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed max-w-xl mb-8 sm:mb-10 drop-shadow"
            >
              Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none"
            >
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
            
            <div
              ref={floatingBadge1Ref}
              className="bg-[#0B1F3A]/85 backdrop-blur-md border border-[#C9A84C]/40 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[280px] pointer-events-auto transform hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">98.4%</div>
                <div className="text-xs text-gray-300 font-medium">Visa Approval Rate</div>
              </div>
            </div>

            <div
              ref={floatingBadge2Ref}
              className="bg-[#0B1F3A]/85 backdrop-blur-md border border-white/20 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[280px] mr-10 pointer-events-auto transform hover:scale-105 transition-transform"
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

      {/* 3. FLOATING STATS CARD OVERLAPPING HERO IMAGE WITH GSAP ANIMATED COUNTERS */}
      <div className="relative z-30 max-w-[1120px] mx-auto px-4 sm:px-6 -mt-12 sm:-mt-20 pb-12">
        <div
          ref={statsRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center divide-y-0 sm:divide-x divide-gray-100"
        >
          <div className="p-2 sm:p-0 border-r border-b sm:border-r-0 sm:border-b-0 border-gray-100">
            <div ref={stat1Ref} className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Students Enrolled</div>
          </div>
          <div className="p-2 sm:p-0 border-b sm:border-b-0 border-gray-100">
            <div ref={stat2Ref} className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0.0%
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Visa Success Rate</div>
          </div>
          <div className="p-2 sm:p-0 border-r sm:border-r-0 border-gray-100 pt-3 sm:pt-0">
            <div ref={stat3Ref} className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Partner Universities</div>
          </div>
          <div className="p-2 sm:p-0 pt-3 sm:pt-0">
            <div ref={stat4Ref} className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              $0M+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </div>

    </main>
  );
}
