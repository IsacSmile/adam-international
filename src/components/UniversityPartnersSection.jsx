import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, MapPin, ArrowRight, Globe, Award, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const partnerUniversities = [
  {
    id: 'dmu',
    name: 'De Montfort University',
    location: 'Leicester, United Kingdom',
    country: 'UK',
    tag: 'Top 50 UK University',
    ranking: '#1 for Employability',
  },
  {
    id: 'bpp',
    name: 'BPP University',
    location: 'London, United Kingdom',
    country: 'UK',
    tag: 'Premier Law & Business School',
    ranking: 'Top Finance & Law Prep',
  },
  {
    id: 'coventry',
    name: 'Coventry University',
    location: 'Coventry, United Kingdom',
    country: 'UK',
    tag: '5-Star QS Rated Institution',
    ranking: '#1 Student Experience',
  },
  {
    id: 'bangor',
    name: 'Bangor University',
    location: 'Bangor, Wales, UK',
    country: 'UK',
    tag: 'Top 10 for Teaching Quality',
    ranking: 'Gold Teaching Excellence',
  },
  {
    id: 'herts',
    name: 'University of Hertfordshire',
    location: 'Hatfield, United Kingdom',
    country: 'UK',
    tag: 'TEF Gold Rated University',
    ranking: '96.5% Graduate Jobs',
  },
  {
    id: 'greenwich',
    name: 'University of Greenwich',
    location: 'London, United Kingdom',
    country: 'UK',
    tag: 'UNESCO World Heritage Campus',
    ranking: 'Top 10 International Students',
  },
  {
    id: 'ue-germany',
    name: 'UE Applied Sciences',
    location: 'Berlin / Hamburg, Germany',
    country: 'EU',
    tag: 'Top German Tech University',
    ranking: 'Top 10 European Tech',
  },
  {
    id: 'northeastern',
    name: 'Northeastern University',
    location: 'Boston, USA',
    country: 'USA',
    tag: 'Tier-1 US Research Institution',
    ranking: 'Global Co-op Leader',
  },
];

export default function UniversityPartnersSection({ onViewAllUniversities }) {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const isHoveredRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for university cards
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    // Continuous 60fps Auto-Scroll Loop with Pause on Hover
    let animationFrameId;

    const autoScroll = () => {
      if (carouselRef.current && !isHoveredRef.current) {
        const el = carouselRef.current;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
          el.scrollLeft = 0; // Reset seamless loop
        } else {
          el.scrollLeft += 1.5; // Smooth 60fps auto-scroll step
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      ctx.revert();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="bg-[#0B1F3A] text-white py-24 sm:py-32 lg:py-36 px-5 sm:px-8 lg:px-12 relative overflow-hidden border-t border-white/10"
    >
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[550px] h-[550px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-[550px] h-[550px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* SECTION HEADING & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>GLOBAL NETWORK</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.16]">
              Leading Universities We{' '}
              <span className="text-[#C9A84C] relative inline-block">
                Collaborate With
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mt-3">
              We partner with top-ranked institutions across the UK, Europe, USA, Canada, Australia and more.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0 self-end">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] hover:border-[#C9A84C] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer backdrop-blur-md"
              aria-label="Previous university"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] hover:border-[#C9A84C] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer backdrop-blur-md"
              aria-label="Next university"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* UNIVERSITY PARTNERS HORIZONTAL CAROUSEL WITH AUTO-SCROLL */}
        <div
          ref={carouselRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          onTouchStart={() => { isHoveredRef.current = true; }}
          onTouchEnd={() => { isHoveredRef.current = false; }}
          className="flex flex-row overflow-x-auto pb-8 pt-2 gap-5 sm:gap-7 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partnerUniversities.map((univ) => (
            <div
              key={univ.id}
              ref={addCardRef}
              className="w-[280px] sm:w-[310px] lg:w-[330px] shrink-0 bg-white/5 border border-white/15 backdrop-blur-md rounded-[24px] p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 group hover:border-[#C9A84C] hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,168,76,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C9A84C]/20 to-transparent rounded-tr-[24px] pointer-events-none" />

              <div>
                {/* Header Icon + Country Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/20 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] flex items-center justify-center transition-colors shadow-md">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#DFBE7A] bg-white/10 border border-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    {univ.country}
                  </span>
                </div>

                {/* University Name */}
                <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#DFBE7A] transition-colors">
                  {univ.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-xs text-gray-300 mb-6 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="truncate">{univ.location}</span>
                </div>
              </div>

              {/* Ranking & Highlight Tags */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                  <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  <span className="truncate">{univ.tag}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C]/80 shrink-0" />
                  <span className="truncate">{univ.ranking}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CENTERED CTA BUTTON */}
        <div className="text-center mt-12 sm:mt-16">
          <button
            type="button"
            onClick={onViewAllUniversities}
            className="inline-flex items-center gap-3 bg-[#C9A84C] text-[#0B1F3A] hover:bg-white hover:text-[#0B1F3A] font-extrabold text-base py-4 px-9 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl group border border-[#C9A84C]"
          >
            <span>View All Universities</span>
            <ArrowRight className="w-5 h-5 text-[#0B1F3A] group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </section>
  );
}
