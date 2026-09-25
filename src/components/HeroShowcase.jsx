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
          
          {/* Desktop/Laptop Left Gradient: dark overlay strictly covering the left text column */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[68%] lg:w-[65%] xl:w-[60%] bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/95 to-transparent z-10 pointer-events-none" />
          
          {/* Mobile/Tablet Gradient */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/85 to-[#0B1F3A]/40 z-10 pointer-events-none" />

          {/* Bottom edge gradient to transition seamlessly into floating stats section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent z-10 pointer-events-none" />
          
          {/* Top edge gradient for header contrast */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0B1F3A]/80 to-transparent z-10 pointer-events-none" />
        </div>

        {/* 2. HERO CONTENT GRID */}
        <div className="max-w-[1280px] mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 xl:col-span-7 text-left max-w-[580px] lg:max-w-none xl:max-w-[650px]">
            
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-5 lg:mb-6 backdrop-blur-md shadow-sm"
            >
              <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <span>Top-Tier Overseas Education Consultancy</span>
            </div>

            <h1
              ref={titleRef}
              className="text-[22px] xs:text-2xl sm:text-4xl lg:text-[34px] xl:text-[44px] 2xl:text-[50px] font-extrabold text-white tracking-normal leading-[1.3] sm:leading-[1.26] lg:leading-[1.24] mb-5 sm:mb-6 lg:mb-7 drop-shadow-lg"
            >
              <span className="block">Architect Your Academic Future</span>
              <span className="block mt-2 sm:mt-2.5">
                With <span className="text-[#C9A84C]">Adam International</span>
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-xs sm:text-base lg:text-sm xl:text-lg text-gray-100 font-normal leading-relaxed max-w-lg mb-6 sm:mb-7 lg:mb-8 drop-shadow"
            >
              Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap xl:flex-nowrap gap-3 sm:gap-3.5 lg:gap-3 xl:gap-4 max-w-md sm:max-w-none"
            >
              <button
                type="button"
                onClick={onBookAppointment}
                onMouseEnter={handlePrimaryMouseEnter}
                onMouseLeave={handlePrimaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0B1F3A] font-bold text-xs sm:text-sm lg:text-xs xl:text-base py-3 sm:py-3.5 px-4 sm:px-5 lg:px-3.5 xl:px-7 rounded-xl cursor-pointer transition-all shadow-xl text-center whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap select-none">Book Free Counseling Session</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A] shrink-0" />
              </button>

              <a
                href="#countries"
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/50 text-white font-medium text-xs sm:text-sm lg:text-xs xl:text-base py-3 sm:py-3.5 px-4 sm:px-5 lg:px-3.5 xl:px-6 rounded-xl transition-all text-center backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap select-none">Explore Top Destinations</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: DUAL VERTICAL INFINITE MARQUEE OF COUNTRY CARDS + FLOATING STATS BADGES (DESKTOP/LAPTOP) */}
          <div className="hidden lg:flex lg:col-span-5 relative h-[420px] items-center justify-end pr-2">
            
            {/* Dual Vertical Columns Container with CSS Gradient Mask */}
            <div 
              className="marquee-col grid grid-cols-2 gap-3 w-full max-w-[310px] xl:max-w-[340px] opacity-90 hover:opacity-100 transition-opacity duration-300"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              }}
            >
              
              {/* Column 1: Top to Bottom Infinite Scroll */}
              <div className="overflow-hidden h-[420px] relative">
                <div className="flex flex-col gap-3 animate-marquee-down">
                  {col1Duplicated.map((c, i) => (
                    <div
                      key={`col1-${i}`}
                      className="w-full bg-[#0B1F3A]/75 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg flex flex-col gap-1.5 group hover:border-[#C9A84C] hover:bg-[#0B1F3A]/90 transition-all cursor-pointer"
                    >
                      <div className="relative h-18 sm:h-20 w-full rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-1 left-1 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-extrabold text-[#0B1F3A] flex items-center gap-1 shadow border border-white/40 truncate max-w-[90%]">
                          <span>{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-gray-200 text-center tracking-wide py-0.5">
                        {c.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Bottom to Top Infinite Scroll */}
              <div className="overflow-hidden h-[420px] relative">
                <div className="flex flex-col gap-3 animate-marquee-up">
                  {col2Duplicated.map((c, i) => (
                    <div
                      key={`col2-${i}`}
                      className="w-full bg-[#0B1F3A]/75 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg flex flex-col gap-1.5 group hover:border-[#C9A84C] hover:bg-[#0B1F3A]/90 transition-all cursor-pointer"
                    >
                      <div className="relative h-18 sm:h-20 w-full rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-1 left-1 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-extrabold text-[#0B1F3A] flex items-center gap-1 shadow border border-white/40 truncate max-w-[90%]">
                          <span>{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-gray-200 text-center tracking-wide py-0.5">
                        {c.count}
                      </div>
                    </div>
                  ))}
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
