import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, MapPin, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';

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
    established: '1870',
  },
  {
    id: 'bpp',
    name: 'BPP University',
    location: 'London, United Kingdom',
    country: 'UK',
    tag: 'Premier Law & Business School',
    established: '1992',
  },
  {
    id: 'coventry',
    name: 'Coventry University',
    location: 'Coventry, United Kingdom',
    country: 'UK',
    tag: '5-Star QS Rated Institution',
    established: '1843',
  },
  {
    id: 'bangor',
    name: 'Bangor University',
    location: 'Bangor, Wales, UK',
    country: 'UK',
    tag: 'Top UK Student Satisfaction',
    established: '1884',
  },
  {
    id: 'herts',
    name: 'University of Hertfordshire',
    location: 'Hatfield, United Kingdom',
    country: 'UK',
    tag: 'TEF Gold Rated University',
    established: '1952',
  },
  {
    id: 'greenwich',
    name: 'University of Greenwich',
    location: 'London, United Kingdom',
    country: 'UK',
    tag: 'UNESCO World Heritage Campus',
    established: '1890',
  },
  {
    id: 'ue-germany',
    name: 'UE Applied Sciences',
    location: 'Berlin / Hamburg, Germany',
    country: 'Europe',
    tag: 'Top German Private University',
    established: '2000',
  },
  {
    id: 'northeastern',
    name: 'Northeastern University',
    location: 'Boston, USA',
    country: 'USA',
    tag: 'Tier-1 US Research Institution',
    established: '1898',
  },
];

export default function UniversityPartnersSection({ onViewAllUniversities }) {
  const sectionRef = useRef(null);
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Background Glow Blobs Parallax Scrub
      if (!isMobile) {
        if (glow1Ref.current) {
          gsap.to(glow1Ref.current, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (glow2Ref.current) {
          gsap.to(glow2Ref.current, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }

      // 2. Header Entrance Timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      headerTl
        .fromTo(badgeRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(titleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      // 3. Cards Stagger Entrance
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 4. CTA Button Entrance
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      y: -6,
      borderColor: '#C9A84C',
      boxShadow: '0 12px 30px rgba(201, 168, 76, 0.15)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const underline = e.currentTarget.querySelector('.gold-card-underline');
    if (underline) {
      gsap.to(underline, {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    const iconBox = e.currentTarget.querySelector('.univ-icon-box');
    if (iconBox) {
      gsap.to(iconBox, {
        backgroundColor: '#C9A84C',
        color: '#0B1F3A',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCardMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const underline = e.currentTarget.querySelector('.gold-card-underline');
    if (underline) {
      gsap.to(underline, {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    const iconBox = e.currentTarget.querySelector('.univ-icon-box');
    if (iconBox) {
      gsap.to(iconBox, {
        backgroundColor: 'rgba(201, 168, 76, 0.15)',
        color: '#C9A84C',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCtaMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#DFBE7A',
      scale: 1.03,
      boxShadow: '0 8px 25px rgba(201, 168, 76, 0.3)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleCtaMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#C9A84C',
      scale: 1,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="bg-[#0B1F3A] text-white py-20 md:py-28 px-5 lg:px-8 relative overflow-hidden border-t border-white/10"
    >
      {/* Background Decorative Gold Glows with Parallax Scrub */}
      <div
        ref={glow1Ref}
        className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none will-change-transform"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-1/4 right-0 translate-x-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none will-change-transform"
      />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* SECTION HEADING */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Globe className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Our Partners</span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            Leading Universities We Collaborate With
          </h2>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed"
          >
            We partner with top-ranked institutions across the UK, Europe, USA, Canada, Australia and more.
          </p>
        </div>

        {/* UNIVERSITY PARTNERS RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerUniversities.map((univ) => (
            <div
              key={univ.id}
              ref={addCardRef}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              className="bg-[#112D53]/60 backdrop-blur-sm border border-white/10 rounded-[12px] p-6 relative overflow-hidden flex flex-col justify-between cursor-pointer transition-colors group"
            >
              <div className="gold-card-underline absolute bottom-0 left-0 w-full h-[3px] bg-[#C9A84C] scale-x-0 transform-origin-left pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="univ-icon-box w-12 h-12 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#DFBE7A] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {univ.country}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#DFBE7A] transition-colors">
                  {univ.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-4 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="truncate">{univ.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <span className="truncate">{univ.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CENTERED CTA BUTTON */}
        <div ref={ctaRef} className="text-center">
          <button
            type="button"
            onClick={onViewAllUniversities}
            onMouseEnter={handleCtaMouseEnter}
            onMouseLeave={handleCtaMouseLeave}
            className="inline-flex items-center gap-2.5 bg-[#C9A84C] text-[#0B1F3A] font-bold text-base py-3.5 px-8 rounded-lg cursor-pointer transition-all shadow-md"
          >
            <span>View All Universities</span>
            <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
          </button>
        </div>

      </div>
    </section>
  );
}
