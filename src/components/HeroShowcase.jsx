import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Award, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroShowcase({ onBookAppointment }) {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Background Glow Parallax Scrub
      if (glowRef.current && !isMobile) {
        gsap.to(glowRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 2. Hero Text Content Subtle Upward Movement
      if (contentRef.current && !isMobile) {
        gsap.to(contentRef.current, {
          yPercent: -12,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 3. Stats Strip Entrance & Subtle Parallax
      if (statsRef.current) {
        gsap.fromTo(statsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main id="home" ref={heroRef} className="relative pb-12">
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0B1F3A] via-[#112D53] to-[#0B1F3A] text-white py-20 lg:py-28 px-5 lg:px-8 overflow-hidden">
        
        {/* Glow backdrop decorative SVG with Parallax */}
        <div
          ref={glowRef}
          className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none will-change-transform"
        />

        <div ref={contentRef} className="max-w-[1280px] mx-auto text-center relative z-10 will-change-transform">
          
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6">
            <Award className="w-4 h-4" />
            <span>Top-Tier Overseas Education Consultancy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Architect Your Academic Future With <span className="text-[#C9A84C]">Adam International</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBookAppointment}
              className="bg-[#C9A84C] hover:bg-[#B5943B] text-[#0B1F3A] font-bold text-base py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Book Free Counseling Session
            </button>
            <a
              href="#countries"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-base py-3.5 px-7 rounded-xl border border-white/20 transition-all duration-200"
            >
              <span>Explore Top Destinations</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Metrics Banner */}
      <section ref={statsRef} className="max-w-[1080px] mx-auto px-5 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">12,500+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Students Enrolled</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">98.4%</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Visa Success Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">450+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Partner Universities</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">$15M+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </section>

    </main>
  );
}
