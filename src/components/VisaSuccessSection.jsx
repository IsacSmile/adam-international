import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Calendar, MapPin, Award, ArrowRight, Stamp, ShieldCheck, ExternalLink } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const successStories = [
  {
    id: 'adith-dinesh',
    name: 'Adith Dinesh',
    country: 'Hungary',
    countryCode: 'HU',
    flag: '🇭🇺',
    date: '13 October 2024',
    visaType: 'Student Visa',
    university: 'University of Debrecen',
    degree: 'B.Sc. Computer Science',
    initials: 'AD',
    studentPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop', // Budapest architecture
  },
  {
    id: 'kiran-sunil-kumar',
    name: 'Kiran Sunil Kumar',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    date: '13 October 2024',
    visaType: 'Student Visa',
    university: 'NEOMA Business School',
    degree: 'Master in Management',
    initials: 'KS',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', // Paris Eiffel Tower
  },
  {
    id: 'anagha-sabu',
    name: 'Anagha Sabu',
    country: 'Hungary',
    countryCode: 'HU',
    flag: '🇭🇺',
    date: '13 October 2024',
    visaType: 'Student Visa',
    university: 'Eötvös Loránd University',
    degree: 'M.Sc. Biotechnology',
    initials: 'AS',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop', // European University Campus
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

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        [badgeRef.current, titleRef.current, subtitleRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stagger Cards Animation
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // CTA Entrance
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className="bg-[#F8FAFC] py-20 sm:py-28 lg:py-32 px-4 sm:px-8 lg:px-12 border-t border-b border-slate-200/80 relative overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-[550px] h-[550px] bg-[#C9A84C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-[550px] h-[550px] bg-[#0B1F3A]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">

        {/* SECTION HEADING BLOCK */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          
          {/* Gold Pill Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-extrabold tracking-wider uppercase backdrop-blur-md shadow-sm mb-4"
          >
            <Stamp className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>VERIFIED SUCCESS</span>
          </div>

          {/* Main Title */}
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.16] mb-3.5"
          >
            Recent Visa Approvals
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed"
          >
            Real students. Real results. Celebrating every successful journey.
          </p>

        </div>

        {/* 3 ELEVATED SUCCESS CARDS (Desktop Grid 3 cols, Mobile Vertical Stack) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {successStories.map((story) => (
            <div
              key={story.id}
              ref={addCardRef}
              className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_8px_30px_rgba(11,31,58,0.06)] hover:shadow-[0_20px_45px_rgba(11,31,58,0.14)] hover:border-[#C9A84C] transition-all duration-500 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-2 cursor-pointer relative"
              onClick={onViewAllStories}
            >
              <div>
                {/* 1. TOP COVER MEDIA BANNER */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={story.coverImage}
                    alt={`${story.country} destination`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent" />

                  {/* Country Flag Pill (Top Left) */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold text-[#0B1F3A] flex items-center gap-1.5 shadow border border-white/50">
                    <span className="text-sm">{story.flag}</span>
                    <span>{story.country}</span>
                  </div>

                  {/* Gold Approved Badge (Top Right) */}
                  <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#0B1F3A] text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#DFBE7A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1F3A] fill-current" />
                    <span>Approved</span>
                  </div>

                  {/* Student Portrait Avatar Overlay (Overlapping bottom left) */}
                  <div className="absolute -bottom-5 left-6">
                    <div className="relative w-16 h-16 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-[#0B1F3A] flex items-center justify-center">
                      <img
                        src={story.studentPhoto}
                        alt={story.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-white font-extrabold text-lg">{story.initials}</span>
                    </div>
                  </div>
                </div>

                {/* 2. CARD CONTENT BODY */}
                <div className="pt-8 p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Student Name */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-snug mb-3">
                      {story.name}
                    </h3>

                    {/* Metadata Items */}
                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 mb-6 pt-1 font-normal">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
                        <span>Destination: <strong className="text-[#0B1F3A] font-semibold">{story.country}</strong></span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#C9A84C] shrink-0" />
                        <span>Visa Type: <strong className="text-[#0B1F3A] font-semibold">{story.visaType}</strong></span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Approval Date: <span className="text-slate-700 font-medium">{story.date}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* 3. CARD FOOTER: Verified badge + Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Approval</span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                      <span>View Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CENTERED CTA BUTTON */}
        <div ref={ctaRef} className="text-center mt-14 sm:mt-16">
          <button
            type="button"
            onClick={onViewAllStories}
            className="inline-flex items-center gap-3 bg-[#0B1F3A] text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] font-extrabold text-base sm:text-lg py-4 px-9 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl group border border-[#0B1F3A]"
          >
            <span>View All Success Stories</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </section>
  );
}

