import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Target, 
  ShieldCheck, 
  Award, 
  Globe, 
  Eye, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const featuresData = [
  {
    id: 'personalized-guidance',
    title: 'Personalized Guidance',
    badge: 'Custom Roadmaps',
    description: 'Every student is unique. We build a tailored study abroad strategy aligned with your academic background, budget, and career ambitions.',
    extendedDetail: 'Includes 1-on-1 profile evaluation, university shortlist analysis, and custom timeline mapping for top global destinations.',
    icon: Target,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'end-to-end-support',
    title: 'End-to-End Support',
    badge: '360° Assistance',
    description: 'From initial application filing to visa processing, scholarship applications, housing arrangements, and post-landing support.',
    extendedDetail: 'Dedicated student coordinator assigned to guide you through every milestone from application submit to arrival at your campus.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'high-visa-success',
    title: 'High Visa Success Rate',
    badge: '100% Visa Track Record',
    description: '100% visa approval rate backed by mock visa interviews, financial documentation verification, and embassy filing precision.',
    extendedDetail: 'Comprehensive document vetting process by senior immigration experts and former embassy visa specialists.',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'university-network',
    title: 'Strong University Network',
    badge: '450+ Global Partners',
    description: 'Direct tie-ups and priority application processing with over 450 leading universities across UK, USA, Canada, Europe & Australia.',
    extendedDetail: 'Application fee waivers, fast-track offer letters within 48 hours, and exclusive institutional scholarship access.',
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'transparent-process',
    title: 'Transparent Process',
    badge: 'Zero Hidden Fees',
    description: '100% transparency with zero hidden fees. Track your application status live and get honest, unbiased advice at every stage.',
    extendedDetail: 'Direct portal access, upfront service agreements, and zero markups on university application and tuition fees.',
    icon: Eye,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'experienced-team',
    title: 'Experienced Team',
    badge: '15+ Years Excellence',
    description: 'Our senior education advisors bring over 15+ years of overseas admissions experience and thousands of successful placements.',
    extendedDetail: 'Certified PIER & British Council accredited counselors with deep expertise in foreign university admissions.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
];

export default function WhyChooseUsSection({ onConsultClick }) {
  const [activeCardId, setActiveCardId] = useState(featuresData[0].id);

  const sectionRef = useRef(null);
  const leftStickyRef = useRef(null);
  const cardsListRef = useRef([]);

  const addCardRef = (el) => {
    if (el && !cardsListRef.current.includes(el)) {
      cardsListRef.current.push(el);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline for Left Sticky Column
      if (leftStickyRef.current) {
        gsap.fromTo(
          leftStickyRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Staggered fade-up for feature cards
      if (cardsListRef.current.length > 0) {
        gsap.fromTo(
          cardsListRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="bg-[#F8FAFC] py-20 lg:py-28 px-5 sm:px-8 lg:px-12 relative overflow-hidden border-t border-b border-slate-200/80"
    >
      {/* Soft Glow Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#C9A84C]/10 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-[#0B1F3A]/8 via-[#C9A84C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ==========================================================================
              LEFT COLUMN (40%): Sticky Pinned Content Area
             ========================================================================== */}
          <div
            ref={leftStickyRef}
            className="lg:col-span-5 lg:sticky lg:top-28 text-left space-y-6"
          >
            {/* Small Gold Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/35 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Why Us</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.15]">
              Why Students Choose{' '}
              <span className="text-[#C9A84C] relative inline-block">
                Adam International
              </span>
            </h2>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              We don’t just process application forms — we build global futures through personalized roadmaps, transparent guidance, and dedicated 1-on-1 mentorship.
            </p>

            {/* Highlight Badges / Quick Stats Pill */}
            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#0B1F3A]">
                <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <span>100% Visa Approval Track Record</span>
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#0B1F3A]">
                <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <span>450+ Partner Universities Worldwide</span>
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#0B1F3A]">
                <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <span>Zero Hidden Charges & Full Transparency</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={onConsultClick}
                className="inline-flex items-center justify-center gap-3 bg-[#0B1F3A] text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] font-bold text-base py-4 px-8 rounded-xl transition-all duration-300 shadow-xl group cursor-pointer"
              >
                <span>Book Free Counseling</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* ==========================================================================
              RIGHT COLUMN (60%): Interactive Feature Cards List
             ========================================================================== */}
          <div className="lg:col-span-7 space-y-5">
            {featuresData.map((feature, idx) => {
              const IconComp = feature.icon;
              const isActive = activeCardId === feature.id;

              return (
                <div
                  key={feature.id}
                  ref={addCardRef}
                  onClick={() => handleCardClick(feature.id)}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'border-[#C9A84C] shadow-2xl ring-1 ring-[#C9A84C]/40 translate-y-[-2px]' 
                      : 'border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#C9A84C]/60 hover:translate-y-[-2px]'
                  }`}
                >
                  <div className="p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    
                    {/* Thumbnail Image + Icon Header */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 shadow-md border border-slate-100">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#0B1F3A]/20" />
                        <div className="absolute bottom-1 right-1 bg-[#0B1F3A] text-[#C9A84C] p-1.5 rounded-lg shadow">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Title & Badge */}
                      <div>
                        <div className="inline-block bg-[#C9A84C]/15 text-[#0B1F3A] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                          {feature.badge}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] leading-snug">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    {/* Expand Indicator */}
                    <div className="self-end sm:self-center shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors">
                      <span>{isActive ? 'Less Details' : 'More Details'}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-[#C9A84C]' : 'rotate-0 text-slate-500'
                        }`}
                      />
                    </div>

                  </div>

                  {/* Description Body */}
                  <div className="px-6 sm:px-7 pb-5">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                      {feature.description}
                    </p>

                    {/* Expandable Extended Details */}
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl text-xs sm:text-sm text-[#0B1F3A] font-medium leading-relaxed flex items-start gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                        <span>{feature.extendedDetail}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
