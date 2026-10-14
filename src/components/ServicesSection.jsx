import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { services } from '../data/services';
import ServiceCard from './shared/ServiceCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    startScrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = startScrollLeftRef.current - walk;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setTimeout(() => setIsDragging(false), 50);
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#F8FAFC] py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-12 relative overflow-hidden border-t border-b border-slate-200/80"
    >
      {/* Soft Glow Background Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#C9A84C]/10 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-[#0B1F3A]/8 via-[#C9A84C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="text-left max-w-2xl">
            {/* Small Gold Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-3.5 py-1.5 rounded-full text-[#0B1F3A] text-[11px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>WHAT WE DO</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.16]">
              Everything you need to study abroad,{' '}
              <span className="text-[#C9A84C] relative inline-block">
                in one place
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed mt-2.5">
              From picking the right course to settling in after you land, we work with you at every step, so you're never figuring it out alone.
            </p>
          </div>

          {/* Slider Controls (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 self-end">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer active:scale-95"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer active:scale-95"
              aria-label="Next service"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DESKTOP HORIZONTAL SCROLL CAROUSEL / MOBILE RESPONSIVE GRID */}
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex md:flex-row flex-col gap-5 sm:gap-6 md:overflow-x-auto md:pb-6 md:pt-1 scrollbar-none select-none ${
            isDragging ? 'md:cursor-grabbing' : 'md:cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {services.map((service) => (
            <div
              key={service.slug}
              ref={addCardRef}
              className="w-full md:w-[310px] lg:w-[330px] xl:w-[340px] shrink-0"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#071426] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
