import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getVisibleUniversities, sortUniversitiesFeaturedFirst } from '../lib/universities';
import UniversityCard from './shared/UniversityCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Show at most 12 universities, prioritizing featured countries first
const visibleUniversities = getVisibleUniversities();
const prioritizedUniversities = sortUniversitiesFeaturedFirst(visibleUniversities).slice(0, 12);

// Tripled list for a perfectly seamless infinite horizontal scroll loop
const infinitePartnerList = [
  ...prioritizedUniversities.map((u, i) => ({ ...u, uniqueKey: `${u.slug}-1-${i}` })),
  ...prioritizedUniversities.map((u, i) => ({ ...u, uniqueKey: `${u.slug}-2-${i}` })),
  ...prioritizedUniversities.map((u, i) => ({ ...u, uniqueKey: `${u.slug}-3-${i}` })),
];

export default function UniversityPartnersSection() {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

  const isPausedRef = useRef(false);
  const scrollPosRef = useRef(0);
  const pauseTimeoutRef = useRef(null);

  // Mouse drag state
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const pauseAutoScrollTemporarily = (durationMs = 3500) => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, durationMs);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for first set of visible cards
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current.slice(0, prioritizedUniversities.length),
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
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

    // Continuous 60fps Subpixel Smooth Auto-Scroll Loop
    let animationFrameId;

    const autoScroll = () => {
      if (carouselRef.current) {
        const el = carouselRef.current;
        const oneSetWidth = el.scrollWidth / 3;

        if (!isPausedRef.current && !isMouseDownRef.current && oneSetWidth > 0) {
          scrollPosRef.current += 1.2;

          // Seamless infinite reset when passing one full set width
          if (scrollPosRef.current >= oneSetWidth) {
            scrollPosRef.current -= oneSetWidth;
          }

          el.scrollLeft = scrollPosRef.current;
        } else if (!isMouseDownRef.current) {
          scrollPosRef.current = el.scrollLeft;
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
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const handleScrollLeft = () => {
    pauseAutoScrollTemporarily(3500);
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    pauseAutoScrollTemporarily(3500);
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    setIsDragging(true);
    pauseAutoScrollTemporarily(10000);
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    startScrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.6;
    carouselRef.current.scrollLeft = startScrollLeftRef.current - walk;
    scrollPosRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
      pauseAutoScrollTemporarily(2500);
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
              <span>PARTNER UNIVERSITIES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.16]">
              Universities we work with
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mt-3">
              We help students apply to universities across Europe and other study destinations, and we're adding more every intake. Tap a university to see courses, fees and entry requirements.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0 self-end">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] hover:border-[#C9A84C] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer backdrop-blur-md active:scale-95"
              aria-label="Previous university"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] hover:border-[#C9A84C] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer backdrop-blur-md active:scale-95"
              aria-label="Next university"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* UNIVERSITY PARTNERS HORIZONTAL CAROUSEL WITH AUTO-SCROLL & DRAG support */}
        <div
          ref={carouselRef}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            isPausedRef.current = false;
          }}
          onTouchStart={() => {
            isPausedRef.current = true;
          }}
          onTouchEnd={() => {
            pauseAutoScrollTemporarily(2500);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex flex-row overflow-x-auto pb-8 pt-2 gap-5 sm:gap-7 scrollbar-none select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {infinitePartnerList.map((univ) => (
            <div
              key={univ.uniqueKey}
              ref={addCardRef}
              className="w-[280px] sm:w-[310px] lg:w-[330px] shrink-0"
            >
              <UniversityCard university={univ} variant="dark" />
            </div>
          ))}
        </div>

        {/* CENTERED CTA BUTTON */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/universities"
            className="inline-flex items-center gap-3 bg-[#C9A84C] text-[#0B1F3A] hover:bg-white hover:text-[#0B1F3A] font-extrabold text-base py-4 px-9 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl group border border-[#C9A84C]"
          >
            <span>View All Universities</span>
            <ArrowRight className="w-5 h-5 text-[#0B1F3A] group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
