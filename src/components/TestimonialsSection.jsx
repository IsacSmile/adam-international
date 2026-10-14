import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Star, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Quote, 
  Award,
  Sparkles,
  ShieldCheck,
  Pause,
  ArrowRight
} from 'lucide-react';
import { successStories } from '../data/successStories';
import { countries } from '../data/countries';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarColors = [
  'bg-indigo-900',
  'bg-emerald-900',
  'bg-purple-900',
  'bg-slate-900',
  'bg-blue-900',
  'bg-[#0B1F3A]',
  'bg-teal-900',
  'bg-amber-900',
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const activeStudent = successStories[activeIndex] || successStories[0];

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);

  // Auto-play timer (changes testimonial every 6s unless paused)
  useEffect(() => {
    if (isAutoplayPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplayPaused]);

  // Animate Card Change with GSAP
  useEffect(() => {
    let ctx;
    if (cardRef.current) {
      ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 15, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
      }, cardRef);
    }
    return () => ctx?.revert();
  }, [activeIndex]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = () => {
    setIsAutoplayPaused(true);
    setActiveIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplayPaused(true);
    setActiveIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
  };

  const handlePillClick = (idx) => {
    setIsAutoplayPaused(true);
    setActiveIndex(idx);
  };

  const countryObj = countries.find((c) => c.slug === activeStudent.country);
  const activeAvatarBg = avatarColors[activeIndex % avatarColors.length];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-[#F8F9FC] py-14 sm:py-20 md:py-28 px-3.5 sm:px-6 lg:px-8 border-t border-b border-gray-200/60 relative overflow-hidden"
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1120px] mx-auto relative z-10">

        {/* 1. TOP BADGE */}
        <div className="text-center mb-4 sm:mb-5">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-md border border-[#C9A84C]/40 text-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
            <span>STUDENT STORIES</span>
          </div>
        </div>

        {/* 2. MAIN TITLE & SUBTITLE */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-2 sm:mb-3">
            Students who've already made the move
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 font-normal leading-relaxed">
            In their own words: what the process was like, what helped, and how life looks now.
          </p>
        </div>

        {/* 3. STUDENT AVATAR SELECTOR PILLS */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-4xl mx-auto px-1">
          {successStories.map((student, idx) => {
            const isSelected = idx === activeIndex;
            const firstName = student.studentName.split(' ')[0];
            const initials = getInitials(student.studentName);
            const avatarBg = avatarColors[idx % avatarColors.length];

            return (
              <button
                key={student.id}
                onClick={() => handlePillClick(idx)}
                type="button"
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white border-2 border-[#C9A84C] shadow-md scale-105 z-10'
                    : 'bg-white text-gray-700 hover:text-[#0B1F3A] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full ${avatarBg} text-white font-bold text-[9px] sm:text-xs flex items-center justify-center shrink-0 border border-white/30 overflow-hidden`}
                >
                  {student.photo ? (
                    <img src={student.photo} alt={student.studentName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <span className="truncate max-w-[55px] sm:max-w-none">{firstName}</span>
              </button>
            );
          })}
        </div>

        {/* 4. FEATURED TESTIMONIAL CARD */}
        <div
          ref={cardRef}
          onMouseEnter={() => setIsAutoplayPaused(true)}
          className="bg-white border border-gray-200 rounded-[24px] sm:rounded-[28px] p-5 sm:p-10 shadow-xl relative max-w-3xl mx-auto overflow-hidden"
        >
          {/* Large Light Gold Quotation Mark */}
          <div className="absolute top-4 right-5 sm:top-6 sm:right-8 text-[#C9A84C]/25 select-none pointer-events-none">
            <Quote className="w-12 h-12 sm:w-20 sm:h-20" />
          </div>

          {/* Top Section: Avatar Frame + Profile Info */}
          <div className="flex flex-row items-center gap-4 sm:gap-6 mb-5 sm:mb-6">
            
            {/* Student Avatar Box (no verified badge per Section 4.6) */}
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${activeAvatarBg} text-white font-bold text-xl sm:text-3xl flex items-center justify-center border-2 sm:border-4 border-gray-100 shadow-md overflow-hidden`}>
                {activeStudent.photo ? (
                  <img src={activeStudent.photo} alt={activeStudent.studentName} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(activeStudent.studentName)}</span>
                )}
              </div>
            </div>

            {/* Student Details & Star Rating */}
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(activeStudent.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                {countryObj && (
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0B1F3A] bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-2 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                    {countryObj.flag} {countryObj.name}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight mb-0.5 sm:mb-1 truncate">
                {activeStudent.studentName}
              </h3>

              <div className="space-y-0.5 text-xs sm:text-sm text-gray-600 font-medium">
                {activeStudent.university && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                    <span className="truncate">{activeStudent.university}</span>
                  </div>
                )}
                {activeStudent.course && (
                  <div className="flex items-center gap-1.5 text-gray-800 font-semibold truncate">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                    <span className="truncate">{activeStudent.course}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Middle Section: Student Quote */}
          {activeStudent.quote && (
            <div className="mb-6 sm:mb-8 pt-3 sm:pt-4 border-t border-gray-100">
              <p className="text-gray-700 text-xs sm:text-base lg:text-lg leading-relaxed italic font-normal">
                "{activeStudent.quote}"
              </p>
            </div>
          )}

          {/* Bottom Footer Metadata Bar */}
          <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2 flex-wrap">
              {countryObj && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>{countryObj.flag} {countryObj.name}</span>
                </div>
              )}
              {activeStudent.intake && (
                <div className="bg-gray-100 text-[#0B1F3A] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] sm:text-xs">
                  {activeStudent.intake}
                </div>
              )}
            </div>

            <Link
              to={`/success-stories#${activeStudent.id}`}
              className="inline-flex items-center gap-1 text-[#0B1F3A] hover:text-[#C9A84C] font-bold text-xs sm:text-sm transition-colors cursor-pointer group shrink-0"
            >
              <span>Read More</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

        </div>

        {/* 5. SLIDER CONTROLS (Student X of Y + PAUSED indicator + Navigation Arrows) */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mt-5 sm:mt-6 px-1 text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <span>Student <strong className="text-[#0B1F3A] font-bold">{activeIndex + 1}</strong> of <strong className="text-[#0B1F3A] font-bold">{successStories.length}</strong></span>
            
            {isAutoplayPaused && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Pause className="w-2.5 h-2.5" />
                <span>Paused</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={handlePrev}
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] transition-all cursor-pointer shadow-sm"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B1F3A] text-white border border-[#0B1F3A] flex items-center justify-center hover:bg-[#071426] transition-all cursor-pointer shadow-sm"
              aria-label="Next story"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* VIEW ALL SUCCESS STORIES BUTTON */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            to="/success-stories"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B1F3A] hover:bg-[#142d52] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>View All Success Stories</span>
            <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
          </Link>
        </div>

        {/* 6. BOTTOM TRUST BADGE STRIP */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 border-r sm:border-r border-gray-200 pr-2">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-[#0B1F3A]">100% Visa Approval</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-[#0B1F3A]">100% Personalised</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C9A84C] text-[#C9A84C] shrink-0" />
            <span className="text-[11px] sm:text-xs lg:text-sm font-bold text-[#0B1F3A]">4.9 / 5 Average Rating</span>
          </div>
        </div>

      </div>
    </section>
  );
}
