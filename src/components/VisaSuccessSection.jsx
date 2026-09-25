import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Calendar, MapPin, Award, ArrowRight, Stamp } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const successStories = [
  {
    id: 'adith-dinesh',
    name: 'Adith Dinesh',
    country: 'Hungary',
    flag: '🇭🇺',
    date: '13 October 2024',
    type: 'Student Visa',
    avatarBg: 'from-blue-600 to-indigo-800',
    initials: 'AD',
  },
  {
    id: 'kiran-sunil-kumar',
    name: 'Kiran Sunil Kumar',
    country: 'France',
    flag: '🇫🇷',
    date: '13 October 2024',
    type: 'Student Visa',
    avatarBg: 'from-navy-deep to-slate-800',
    initials: 'KS',
  },
  {
    id: 'anagha-sabu',
    name: 'Anagha Sabu',
    country: 'Hungary',
    flag: '🇭🇺',
    date: '13 October 2024',
    type: 'Student Visa',
    avatarBg: 'from-amber-600 to-[#0B1F3A]',
    initials: 'AS',
  },
];

export default function VisaSuccessSection({ onViewAllStories }) {
  const sectionRef = useRef(null);
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

  // ==========================================================================
  // GSAP SCROLLTRIGGER ENTRANCE ANIMATION
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Entrance
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      headerTl
        .fromTo(badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      // Stagger Cards Entrance
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // CTA Button Entrance
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

  // Card Hover GSAP Animation
  const handleCardMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      y: -6,
      scale: 1.02,
      borderColor: '#C9A84C',
      boxShadow: '0 20px 35px rgba(11, 31, 58, 0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const approvedBadge = e.currentTarget.querySelector('.approved-badge');
    if (approvedBadge) {
      gsap.to(approvedBadge, {
        scale: 1.05,
        backgroundColor: '#C9A84C',
        color: '#0B1F3A',
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  const handleCardMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: 'rgba(229, 231, 235, 1)',
      boxShadow: '0 4px 12px rgba(11, 31, 58, 0.04)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const approvedBadge = e.currentTarget.querySelector('.approved-badge');
    if (approvedBadge) {
      gsap.to(approvedBadge, {
        scale: 1,
        backgroundColor: 'rgba(201, 168, 76, 0.15)',
        color: '#0B1F3A',
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  // CTA Button Hover GSAP Animation
  const handleCtaMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#0B1F3A',
      color: '#FFFFFF',
      borderColor: '#0B1F3A',
      scale: 1.02,
      boxShadow: '0 8px 20px rgba(11, 31, 58, 0.2)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleCtaMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: 'transparent',
      color: '#0B1F3A',
      borderColor: '#0B1F3A',
      scale: 1,
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className="bg-[#F8F9FC] py-20 md:py-28 px-5 lg:px-8 border-t border-b border-gray-200/60 relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* SECTION HEADING */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Stamp className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Success Stories</span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-4"
          >
            Recent Visa Approvals
          </h2>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed"
          >
            Real students. Real results. Celebrating every successful journey.
          </p>

        </div>

        {/* VISA SUCCESS CARDS GRID (3 columns on desktop, 1 on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {successStories.map((story) => (
            <div
              key={story.id}
              ref={addCardRef}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              className="bg-white border border-gray-200 rounded-[16px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-sm relative transition-colors overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0B1F3A] via-[#C9A84C] to-[#0B1F3A]" />

              <div>
                {/* Header: Student Avatar Badge & Country Flag + Approved Pill */}
                <div className="flex items-center justify-between mb-6">
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${story.avatarBg} text-white font-bold text-lg flex items-center justify-center shadow-md border border-white/20`}>
                      {story.initials}
                    </div>
                    <div>
                      <span className="text-2xl">{story.flag}</span>
                    </div>
                  </div>

                  {/* Small Gold "Approved" Badge */}
                  <div className="approved-badge inline-flex items-center gap-1.5 bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#0B1F3A] text-xs font-semibold px-3 py-1 rounded-full transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Approved</span>
                  </div>

                </div>

                {/* Student Name */}
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-snug group-hover:text-[#0B1F3A] transition-colors">
                  {story.name}
                </h3>

                {/* Country + Visa Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-6 font-normal">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Destination: <strong className="text-[#0B1F3A] font-semibold">{story.country}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Visa Type: <strong className="text-[#0B1F3A] font-semibold">{story.type}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Approval Date: {story.date}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Approval
                </span>
                <span className="text-gray-400 font-normal">Adam International</span>
              </div>
            </div>
          ))}
        </div>

        {/* CENTERED CTA BUTTON */}
        <div ref={ctaRef} className="text-center">
          <button
            type="button"
            onClick={onViewAllStories}
            onMouseEnter={handleCtaMouseEnter}
            onMouseLeave={handleCtaMouseLeave}
            className="inline-flex items-center gap-2.5 border-2 border-[#0B1F3A] text-[#0B1F3A] font-bold text-base py-3.5 px-8 rounded-lg cursor-pointer transition-all shadow-sm"
          >
            <span>View All Success Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
