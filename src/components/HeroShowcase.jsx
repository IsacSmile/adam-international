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

// Bright, inspiring, high-resolution Unsplash image of international students on campus
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop";

// Country Datasets for Vertical Scrolling Columns
const countryCol1 = [
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    count: '150+ Universities',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'France',
    flag: '🇫🇷',
    count: '80+ Universities',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    count: '60+ Universities',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    count: '35+ Universities',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=400&auto=format&fit=crop',
  },
];

const countryCol2 = [
  {
    name: 'United States',
    flag: '🇺🇸',
    count: '120+ Universities',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    count: '75+ Universities',
    image: 'https://images.unsplash.com/photo-1517935703635-27c5696e850b?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    count: '50+ Universities',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    count: '25+ Universities',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=400&auto=format&fit=crop',
  },
];

// Tripled lists for seamless vertical infinite marquee
const col1Duplicated = [...countryCol1, ...countryCol1, ...countryCol1];
const col2Duplicated = [...countryCol2, ...countryCol2, ...countryCol2];

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

      // Metric 2: Visa Success Rate (0% -> 100%)
      gsap.to(count2Obj, {
        val: 100,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          if (stat2Ref.current) {
            stat2Ref.current.innerText = Math.floor(count2Obj.val) + '%';
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
          y: -6,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.easeInOut',
        });
        gsap.to(floatingBadge2Ref.current, {
          y: 6,
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
    <main id="home" ref={heroRef} className="relative bg-[#0B1F3A] overflow-hidden lg:h-[calc(100vh-72px)] lg:min-h-[640px] flex flex-col justify-between">
      {/* Dynamic Keyframe Style Rules for Dual Vertical Infinite Marquee */}
      <style>{`
        @keyframes verticalMarqueeDown {
          0% { transform: translateY(-33.333%); }
          100% { transform: translateY(0%); }
        }
        @keyframes verticalMarqueeUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-33.333%); }
        }
        .animate-marquee-down {
          animation: verticalMarqueeDown 24s linear infinite;
        }
        .animate-marquee-up {
          animation: verticalMarqueeUp 24s linear infinite;
        }
        .marquee-col:hover .animate-marquee-down,
        .marquee-col:hover .animate-marquee-up {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="relative flex-1 flex items-center pt-8 sm:pt-12 lg:pt-6 pb-6 lg:pb-2 px-5 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Background Image & Balanced Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={bgImgRef}
            src={HERO_BG_IMAGE}
            alt="International university campus and students"
            className="w-full h-full object-cover object-right-top will-change-transform opacity-70 sm:opacity-80 lg:opacity-95 contrast-[1.05] brightness-[1.05]"
          />
          
          {/* Desktop Left Gradient: dark overlay strictly covering the left text column (60% width) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/95 to-transparent z-10 pointer-events-none" />
          
          {/* Mobile/Tablet Gradient */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-[#0B1F3A]/40 z-10 pointer-events-none" />

          {/* Bottom edge gradient to transition seamlessly into floating stats section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent z-10 pointer-events-none" />
          
          {/* Top edge gradient for header contrast */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0B1F3A]/80 to-transparent z-10 pointer-events-none" />
        </div>

        {/* 2. HERO CONTENT GRID */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 text-left">
            
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-5 backdrop-blur-md shadow-sm"
            >
              <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Top-Tier Overseas Education Consultancy</span>
            </div>

            <h1
              ref={titleRef}
              className="text-[21px] xs:text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] mb-4 sm:mb-5 drop-shadow-lg"
            >
              <span className="block whitespace-nowrap">Architect Your Academic Future</span>
              <span className="block mt-1">
                With <span className="text-[#C9A84C]">Adam International</span>
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-sm sm:text-base lg:text-lg text-gray-100 font-normal leading-relaxed max-w-xl mb-6 sm:mb-7 drop-shadow"
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
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0B1F3A] font-bold text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-7 rounded-xl cursor-pointer transition-all shadow-xl text-center"
              >
                <span>Book Free Counseling Session</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A] shrink-0" />
              </button>

              <a
                href="#countries"
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/50 text-white font-medium text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-xl transition-all text-center backdrop-blur-md shadow-sm"
              >
                <span>Explore Top Destinations</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: DUAL VERTICAL INFINITE MARQUEE OF COUNTRY CARDS + FLOATING STATS BADGES (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-5 relative h-[420px] items-center justify-center overflow-hidden pr-2">
            
            {/* Top & Bottom Fade Out Gradients for Vertical Marquee */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B1F3A] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B1F3A] to-transparent z-10 pointer-events-none" />

            {/* Dual Vertical Columns Container */}
            <div className="marquee-col grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[350px] opacity-75 hover:opacity-100 transition-opacity duration-300">
              
              {/* Column 1: Top to Bottom Infinite Scroll */}
              <div className="overflow-hidden h-[420px] relative">
                <div className="flex flex-col gap-3.5 animate-marquee-down">
                  {col1Duplicated.map((c, i) => (
                    <div
                      key={`col1-${i}`}
                      className="w-full bg-[#0B1F3A]/90 backdrop-blur-md border border-white/20 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-col gap-1.5 group hover:border-[#C9A84C] transition-all cursor-pointer"
                    >
                      <div className="relative h-20 sm:h-24 w-full rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/20 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-extrabold text-[#0B1F3A] flex items-center gap-1 shadow border border-white/40">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-300 text-center tracking-wide">
                        {c.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Bottom to Top Infinite Scroll */}
              <div className="overflow-hidden h-[420px] relative">
                <div className="flex flex-col gap-3.5 animate-marquee-up">
                  {col2Duplicated.map((c, i) => (
                    <div
                      key={`col2-${i}`}
                      className="w-full bg-[#0B1F3A]/90 backdrop-blur-md border border-white/20 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-col gap-1.5 group hover:border-[#C9A84C] transition-all cursor-pointer"
                    >
                      <div className="relative h-20 sm:h-24 w-full rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/20 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-extrabold text-[#0B1F3A] flex items-center gap-1 shadow border border-white/40">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-300 text-center tracking-wide">
                        {c.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* OVERLAY FLOATING STATS BADGES PINNED ON TOP OF THE VERTICAL MARQUEE */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center gap-5 pointer-events-none">
              <div
                ref={floatingBadge1Ref}
                className="bg-[#0B1F3A]/95 backdrop-blur-md border border-[#C9A84C]/60 text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[270px] pointer-events-auto transform hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-[#C9A84C] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">100%</div>
                  <div className="text-xs text-gray-300 font-medium">Visa Approval Rate</div>
                </div>
              </div>

              <div
                ref={floatingBadge2Ref}
                className="bg-[#0B1F3A]/95 backdrop-blur-md border border-white/30 text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[270px] pointer-events-auto transform hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-white/20 text-[#C9A84C] flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-5 h-5 text-[#DFBE7A]" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">450+ Universities</div>
                  <div className="text-xs text-gray-300 font-medium">UK, USA, EU, Canada</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. FLOATING STATS CARD OVERLAPPING HERO IMAGE WITH GSAP ANIMATED COUNTERS */}
      <div className="relative z-30 max-w-[1120px] mx-auto px-4 sm:px-6 w-full pb-4 sm:pb-6 lg:pb-5">
        <div
          ref={statsRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center divide-y-0 sm:divide-x divide-gray-100"
        >
          <div className="p-2 sm:p-0 border-r border-b sm:border-r-0 sm:border-b-0 border-gray-100">
            <div ref={stat1Ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Students Enrolled</div>
          </div>
          <div className="p-2 sm:p-0 border-b sm:border-b-0 border-gray-100">
            <div ref={stat2Ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0%
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Visa Success Rate</div>
          </div>
          <div className="p-2 sm:p-0 border-r sm:border-r-0 border-gray-100 pt-3 sm:pt-0">
            <div ref={stat3Ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              0+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Partner Universities</div>
          </div>
          <div className="p-2 sm:p-0 pt-3 sm:pt-0">
            <div ref={stat4Ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              $0M+
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </div>

    </main>
  );
}
