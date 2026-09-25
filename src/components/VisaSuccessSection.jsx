import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Calendar, MapPin, Award, ArrowRight, Stamp, ShieldCheck, FileCheck2, Sparkles, X, GraduationCap, Quote } from 'lucide-react';

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
    visaType: 'Student Visa (Subclass D)',
    university: 'University of Debrecen',
    degree: 'B.Sc. Computer Science',
    initials: 'AD',
    studentPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop',
    stampId: 'HUN-2024-8849',
    story: 'Adith approached Adam International seeking a world-class Computer Science program in Europe within an optimal budget. Our counseling team executed his university application to the University of Debrecen, optimized his motivation letter, audited financial proof documentation, and conducted 3 intensive embassy mock interviews. His student visa was stamped in just 18 days with zero queries!',
    quote: 'Adam International made my European study dream hassle-free. From document audit to mock visa prep, their team was beside me at every single step.',
    highlights: ['18-Day Fast-Track Approval', '100% University Application Waiver', 'Zero-Query Embassy File Clearance', 'Pre-Departure & Forex Support'],
  },
  {
    id: 'kiran-sunil-kumar',
    name: 'Kiran Sunil Kumar',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    date: '13 October 2024',
    visaType: 'Student Visa (VLS-TS)',
    university: 'NEOMA Business School',
    degree: 'Master in Management (MIM)',
    initials: 'KS',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    stampId: 'FRA-2024-5120',
    story: 'Kiran aimed to study business management in Paris at NEOMA Business School. Adam International led his Campus France registration, interview coaching, Paris student housing verification, and financial proof vetting. His French VLS-TS long-stay student visa was granted seamlessly on the first attempt!',
    quote: 'The team at Adam International is exceptionally dedicated. They managed my Campus France filing and visa documentation effortlessly!',
    highlights: ['Campus France Interview Prep', 'Verified Paris Housing Booking', 'Collateral-Free Loan Assistance', '100% Visa Approval Track Record'],
  },
  {
    id: 'anagha-sabu',
    name: 'Anagha Sabu',
    country: 'Hungary',
    countryCode: 'HU',
    flag: '🇭🇺',
    date: '13 October 2024',
    visaType: 'Student Visa (Subclass D)',
    university: 'Eötvös Loránd University (ELTE)',
    degree: 'M.Sc. Biotechnology',
    initials: 'AS',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop',
    stampId: 'HUN-2024-9103',
    story: 'Anagha wanted to specialize in Biotechnology at Eötvös Loránd University in Budapest. Our team structured her academic transcript evaluation, recommendation letter validation, and embassy interview dossier. Her visa was approved seamlessly, empowering her to start her European research career!',
    quote: 'Securing my admit and visa for Hungary was super structured thanks to Adam International’s transparent and step-by-step guidance.',
    highlights: ['Merit Scholarship Nomination', 'Fast-Track Embassy Dossier Vetting', 'Post-Landing Airport & Transit Support', '1-on-1 Profile Assessment'],
  },
];

export default function VisaSuccessSection({ onViewAllStories }) {
  const [activeStory, setActiveStory] = useState(null);

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

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveStory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      {/* Background Decorative Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#C9A84C]/8 via-[#0B1F3A]/4 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C9A84C]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">

        {/* SECTION HEADING BLOCK */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          
          {/* Gold Pill Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-extrabold tracking-wider uppercase backdrop-blur-md shadow-sm mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>VERIFIED VISA APPROVALS</span>
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

        {/* 3 ELEVATED MODERN VISA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {successStories.map((story) => (
            <div
              key={story.id}
              ref={addCardRef}
              onClick={() => setActiveStory(story)}
              className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_10px_35px_rgba(11,31,58,0.06)] hover:shadow-[0_22px_50px_rgba(11,31,58,0.15)] hover:border-[#C9A84C] transition-all duration-500 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-2 cursor-pointer relative"
            >
              {/* Top Decorative Gold Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0B1F3A] via-[#C9A84C] to-[#0B1F3A]" />

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  
                  {/* Top Row: Country Badge + Approved Pill */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    {/* Country Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border border-white/20">
                      <span className="text-base leading-none">{story.flag}</span>
                      <span className="tracking-wide">{story.country}</span>
                    </div>

                    {/* Approved Pill */}
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100" />
                      <span>Approved</span>
                    </div>
                  </div>

                  {/* Student Info Box (Avatar + Name) */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl border-2 border-[#C9A84C]/40 shadow-md overflow-hidden bg-[#0B1F3A] flex items-center justify-center">
                        <img
                          src={story.studentPhoto}
                          alt={story.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-white font-black text-lg">{story.initials}</span>
                      </div>
                      
                      {/* Floating Check Badge on Avatar */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B1F3A] text-[#C9A84C] border border-[#C9A84C] flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-tight truncate">
                        {story.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-[#C9A84C]" />
                        <span>Visa Ref: {story.stampId}</span>
                      </p>
                    </div>
                  </div>

                  {/* Data Document Box */}
                  <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-4 mb-6 space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-slate-600 font-medium">
                      <span className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span>Destination</span>
                      </span>
                      <strong className="text-[#0B1F3A] font-bold">{story.country}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span>Visa Type</span>
                      </span>
                      <strong className="text-[#0B1F3A] font-bold">{story.visaType}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Approval Date</span>
                      </span>
                      <span className="text-slate-800 font-semibold">{story.date}</span>
                    </div>
                  </div>

                </div>

                {/* Card Bottom Verification Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Approval</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStory(story);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors cursor-pointer hover:underline"
                  >
                    <span>View Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
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

      {/* ==========================================================================
          INTERACTIVE VISA SUCCESS STORY MODAL
         ========================================================================== */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B1F3A]/75 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="bg-white rounded-[28px] border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl relative transform animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Banner */}
            <div className="relative bg-[#0B1F3A] text-white p-6 sm:p-8 overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Stamp Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Stamp className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>VISA SUCCESS CERTIFICATE • VERIFIED</span>
              </div>

              {/* Student Header Details */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#C9A84C] shadow-lg overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                  <img
                    src={activeStory.studentPhoto}
                    alt={activeStory.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-white font-black text-xl sm:text-2xl">{activeStory.initials}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl sm:text-2xl">{activeStory.flag}</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      {activeStory.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>{activeStory.degree} • {activeStory.university}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium block mb-0.5">Destination</span>
                  <strong className="text-[#0B1F3A] font-bold text-sm sm:text-base flex items-center gap-1">
                    <span>{activeStory.flag}</span> {activeStory.country}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block mb-0.5">Visa Category</span>
                  <strong className="text-[#0B1F3A] font-bold text-xs sm:text-sm">{activeStory.visaType}</strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 font-medium block mb-0.5">Approval Date</span>
                  <strong className="text-emerald-700 font-bold text-xs sm:text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline shrink-0" /> {activeStory.date}
                  </strong>
                </div>
              </div>

              {/* Story Narrative */}
              <div>
                <h4 className="text-xs font-extrabold text-[#0B1F3A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Success Story Journey</span>
                </h4>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  {activeStory.story}
                </p>
              </div>

              {/* Student Quote Box */}
              {activeStory.quote && (
                <div className="bg-[#0B1F3A]/5 border-l-4 border-[#C9A84C] p-4 rounded-r-2xl italic text-xs sm:text-sm text-[#0B1F3A] font-medium flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <p>"{activeStory.quote}"</p>
                </div>
              )}

              {/* Key Highlights */}
              <div>
                <h4 className="text-xs font-extrabold text-[#0B1F3A] uppercase tracking-wider mb-2.5">
                  Key Application Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeStory.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-[#0B1F3A] bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Controls */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Embassy Approval Stamp</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-bold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStory(null);
                    if (onViewAllStories) onViewAllStories();
                  }}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#C9A84C] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white font-extrabold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

