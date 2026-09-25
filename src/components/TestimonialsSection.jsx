import React, { useState, useEffect, useRef } from 'react';
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
  Pause
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 8 Verified Student Testimonials matching the wireframe layout
const studentTestimonials = [
  {
    id: 1,
    name: 'Sreehari',
    fullName: 'Sreehari Nair',
    avatarInitials: 'SN',
    avatarBg: 'bg-indigo-900',
    universityTag: 'DE MONTFORT UNIV',
    university: 'De Montfort University',
    course: 'M.Sc. Data Science & AI',
    location: 'Leicester, UK',
    tagPill: 'Data Science Admission',
    quote: 'Adam International turned my dream of studying Data Science in the UK into reality. Their counselors guided me through every step from SOP writing to visa interview preparation!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Aparna',
    fullName: 'Aparna Radhakrishnan',
    avatarInitials: 'AR',
    avatarBg: 'bg-emerald-900',
    universityTag: 'BPP UNIV LONDON',
    university: 'BPP University',
    course: 'LL.M. International Commercial Law',
    location: 'London, UK',
    tagPill: 'Law Degree Admission',
    quote: 'The team at Adam International is exceptionally dedicated. They managed my university admission and visa application effortlessly. Highly recommended for any serious study abroad aspirant!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jisni',
    fullName: 'Jisni Joseph',
    avatarInitials: 'JJ',
    avatarBg: 'bg-purple-900',
    universityTag: 'COVENTRY UNIV',
    university: 'Coventry University',
    course: 'MBA International Business',
    location: 'Coventry, UK',
    tagPill: 'MBA Admission',
    quote: 'Securing an admission at Coventry with scholarship support was made seamless by Adam International. Their transparent guidance gave me complete confidence.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Fasna',
    fullName: 'Fasna Mohamed',
    avatarInitials: 'FM',
    avatarBg: 'bg-slate-900',
    universityTag: 'FH BFI VIENNA',
    university: 'FH BFI Vienna',
    course: 'M.Sc. Banking & Finance',
    location: 'Vienna, Austria',
    tagPill: 'Banking & Finance Admission',
    quote: 'Adam International is genuine, affordable, and truly student-focused. They helped me narrow down suitable courses and secure my admission to Banking & Finance in Austria!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Aswathi',
    fullName: 'Aswathi Krishna',
    avatarInitials: 'AK',
    avatarBg: 'bg-blue-900',
    universityTag: 'BANGOR UNIV',
    university: 'Bangor University',
    course: 'M.Sc. Healthcare Management',
    location: 'Bangor, Wales, UK',
    tagPill: 'Healthcare Mgmt Admission',
    quote: 'From choosing the course to getting my student visa stamped, Adam International delivered flawless support. Their post-landing assistance in Wales was invaluable!',
    rating: 5,
  },
  {
    id: 6,
    name: 'Angel',
    fullName: 'Angel Varghese',
    avatarInitials: 'AV',
    avatarBg: 'bg-[#0B1F3A]',
    universityTag: 'UE GERMANY',
    university: 'UE Applied Sciences',
    course: 'M.Eng. Software Engineering',
    location: 'Berlin, Germany',
    tagPill: 'Engineering Admission',
    quote: 'Studying in Germany tuition-free seemed complicated until I consulted Adam International. They handled the paperwork meticulously and secured my university admit!',
    rating: 5,
  },
  {
    id: 7,
    name: 'Ramya',
    fullName: 'Ramya Sundaram',
    avatarInitials: 'RS',
    avatarBg: 'bg-teal-900',
    universityTag: 'GREENWICH UNIV',
    university: 'University of Greenwich',
    course: 'M.Sc. Supply Chain Management',
    location: 'London, UK',
    tagPill: 'Logistics Admission',
    quote: 'I received personal 1-on-1 counseling at Adam International’s office. They resolved all my doubts regarding finances and visa submission. 100% genuine agency!',
    rating: 5,
  },
  {
    id: 8,
    name: 'Arun',
    fullName: 'Arun Kumar',
    avatarInitials: 'AK',
    avatarBg: 'bg-amber-900',
    universityTag: 'NORTHEASTERN US',
    university: 'Northeastern University',
    course: 'M.S. Computer Science',
    location: 'Boston, USA',
    tagPill: 'US STEM Admission',
    quote: 'Targeting a top US STEM program was stressful, but Adam International made my US visa interview prep super structured. I got my F1 visa approved on the first attempt!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(3); // Default Fasna
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const activeStudent = studentTestimonials[activeIndex];

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);

  // Auto-play timer (changes testimonial every 6s unless paused)
  useEffect(() => {
    if (isAutoplayPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === studentTestimonials.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplayPaused]);

  // Animate Card Change with GSAP
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
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
    setActiveIndex((prev) => (prev === 0 ? studentTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplayPaused(true);
    setActiveIndex((prev) => (prev === studentTestimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePillClick = (idx) => {
    setIsAutoplayPaused(true);
    setActiveIndex(idx);
  };

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
            <span>Verified Student Success Stories</span>
          </div>
        </div>

        {/* 2. MAIN TITLE & SUBTITLE */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-2 sm:mb-3">
            Real Students. Proven Pathways.
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 font-normal leading-relaxed">
            Hear directly from international students successfully studying in top global public universities.
          </p>
        </div>

        {/* 3. STUDENT AVATAR SELECTOR PILLS (Mobile-optimized 4x2 grid or flex wrap) */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-4xl mx-auto px-1">
          {studentTestimonials.map((student, idx) => {
            const isSelected = idx === activeIndex;

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
                  className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full ${student.avatarBg} text-white font-bold text-[9px] sm:text-xs flex items-center justify-center shrink-0 border border-white/30`}
                >
                  {student.avatarInitials}
                </div>
                <span className="truncate max-w-[55px] sm:max-w-none">{student.name}</span>
              </button>
            );
          })}
        </div>

        {/* 4. FEATURED TESTIMONIAL CARD (Mobile Responsive & Matching Mobile Wireframe) */}
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
            
            {/* Student Avatar Box with VERIFIED Badge */}
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${activeStudent.avatarBg} text-white font-bold text-xl sm:text-3xl flex items-center justify-center border-2 sm:border-4 border-gray-100 shadow-md`}>
                {activeStudent.avatarInitials}
              </div>
              
              {/* "VERIFIED" Red/Gold Pill Overlay on Bottom Edge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0B1F3A] text-[#C9A84C] text-[8px] sm:text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider border border-[#C9A84C]/50 flex items-center gap-1 shadow whitespace-nowrap">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>Verified</span>
              </div>
            </div>

            {/* Student Details & Star Rating */}
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(activeStudent.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0B1F3A] bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-2 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                  {activeStudent.universityTag}
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight mb-0.5 sm:mb-1 truncate">
                {activeStudent.fullName}
              </h3>

              <div className="space-y-0.5 text-xs sm:text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-1.5 truncate">
                  <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="truncate">{activeStudent.university}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span className="truncate">{activeStudent.course}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Middle Section: Student Quote */}
          <div className="mb-6 sm:mb-8 pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-gray-700 text-xs sm:text-base lg:text-lg leading-relaxed italic font-normal">
              "{activeStudent.quote}"
            </p>
          </div>

          {/* Bottom Footer Metadata Bar */}
          <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
              <span>{activeStudent.location}</span>
            </div>

            <div className="self-start sm:self-auto bg-gray-100 text-[#0B1F3A] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] sm:text-xs">
              {activeStudent.tagPill}
            </div>
          </div>

        </div>

        {/* 5. SLIDER CONTROLS (Student X of Y + PAUSED indicator + Navigation Arrows) */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mt-5 sm:mt-6 px-1 text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <span>Student <strong className="text-[#0B1F3A] font-bold">{activeIndex + 1}</strong> of <strong className="text-[#0B1F3A] font-bold">{studentTestimonials.length}</strong></span>
            
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
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B1F3A] text-white border border-[#0B1F3A] flex items-center justify-center hover:bg-[#071426] transition-all cursor-pointer shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 6. BOTTOM TRUST BADGE STRIP (Responsive 2 cols top + 1 col bottom on mobile) */}
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
