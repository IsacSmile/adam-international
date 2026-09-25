import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { 
  Compass, 
  GraduationCap, 
  Landmark, 
  FileCheck, 
  PlaneTakeoff, 
  BookOpenCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const servicesData = [
  {
    id: 'career-counseling',
    title: 'Career Counseling',
    badge: 'Profile Evaluation',
    description: 'Personalized 1-on-1 guidance to choose the ideal university and degree program aligned with your profile, budget, and long-term career goals.',
    highlights: ['1-on-1 Profile Assessment', 'Country & Course ROI Analysis'],
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'admission-support',
    title: 'Admission Support',
    badge: 'University Filing',
    description: 'End-to-end support with university applications, SOP drafting, LOR optimization, portfolio review, and application fee waivers.',
    highlights: ['Fast-Track Offer Letters', '450+ Partner Universities'],
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'financial-assistance',
    title: 'Financial & Loan Assistance',
    badge: 'Scholarships & Funding',
    description: 'Expert guidance on institutional scholarships, merit grants, financial proof audit, and collateral-free education loans from leading banks.',
    highlights: ['$15M+ Scholarships Secured', 'Collateral-Free Bank Loans'],
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'visa-assistance',
    title: 'Documentation & Visa Assistance',
    badge: '100% Visa Track Record',
    description: 'Complete visa documentation vetting, embassy file preparation, financial proof verification, and mock embassy interview sessions.',
    highlights: ['100% Visa Approval Rate', 'Former Officer Document Vetting'],
    icon: FileCheck,
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pre-departure',
    title: 'Pre-Departure & Post-Landing',
    badge: 'Travel & Housing',
    description: 'Comprehensive travel briefings, verified student housing booking, airport pickup coordination, forex card setup, and health insurance.',
    highlights: ['Verified Student Housing', 'Airport Pickup & Forex Setup'],
    icon: PlaneTakeoff,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'training-interview',
    title: 'Training & Interview Prep',
    badge: 'IELTS / PTE / Mock Prep',
    description: 'Intensive coaching for IELTS, PTE, and TOEFL along with university admission and embassy visa mock interview prep sessions.',
    highlights: ['Certified Language Trainers', 'Unlimited Mock Test Materials'],
    icon: BookOpenCheck,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  },
];

export default function ServicesSection({ onSelectService }) {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

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
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
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

    return () => ctx.revert();
  }, []);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#F8FAFC] py-24 sm:py-32 lg:py-36 px-5 sm:px-8 lg:px-12 relative overflow-hidden border-t border-b border-slate-200/80"
    >
      {/* Soft Glow Background Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#C9A84C]/10 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-[#0B1F3A]/8 via-[#C9A84C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* ==========================================================================
            HEADER BLOCK: Centered Title + Navigation Control Buttons
           ========================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-left max-w-2xl">
            {/* Small Gold Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>OUR EXPERTISE</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.16]">
              Comprehensive Overseas{' '}
              <span className="text-[#C9A84C] relative inline-block">
                Education Services
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mt-3">
              From course selection and application filing to visa processing, financial aid, and post-landing settlement — we guide every step of your global journey.
            </p>
          </div>

          {/* Slider Controls (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3 shrink-0 self-end">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#C9A84C] hover:border-[#0B1F3A] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer"
              aria-label="Next service"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ==========================================================================
            DESKTOP HORIZONTAL SCROLL CAROUSEL / MOBILE RESPONSIVE GRID
           ========================================================================== */}
        <div
          ref={carouselRef}
          className="flex md:flex-row flex-col gap-6 sm:gap-8 md:overflow-x-auto md:pb-8 md:pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {servicesData.map((service) => {
            const IconComp = service.icon;

            return (
              <div
                key={service.id}
                ref={addCardRef}
                onClick={() => onSelectService && onSelectService(service)}
                className="w-full md:w-[360px] lg:w-[400px] shrink-0 snap-start bg-white rounded-[24px] border border-slate-200/90 shadow-[0_6px_24px_rgba(11,31,58,0.05)] hover:shadow-[0_20px_40px_rgba(11,31,58,0.12)] hover:border-[#C9A84C] transition-all duration-300 flex flex-col justify-between group cursor-pointer overflow-hidden transform hover:-translate-y-2"
              >
                {/* 1. TOP IMAGE AREA */}
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-[#0B1F3A]/20 to-transparent" />
                  
                  {/* Category Pill Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0B1F3A] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow border border-white/40">
                    {service.badge}
                  </div>

                  {/* Icon Floating Badge */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shadow-lg border border-[#C9A84C]/40 group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. CARD BODY CONTENT */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Service Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors">
                      {service.title}
                    </h3>

                    {/* Service Description */}
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-6">
                      {service.description}
                    </p>

                    {/* Bullet Highlights */}
                    <div className="space-y-2 mb-6 pt-2 border-t border-slate-100">
                      {service.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0B1F3A]">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. CARD ACTION LINK */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                    <span>Explore Service</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
