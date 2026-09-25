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
  ChevronRight,
  Star,
  Shield
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const featuresData = [
  {
    id: 'personalized-guidance',
    title: 'Personalized Guidance',
    badge: 'Custom Roadmaps',
    isFeatured: true,
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
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#C9A84C]/10 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#0B1F3A]/8 via-[#C9A84C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>WHY US</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.14]">
              Why Students Choose{' '}
              <span className="text-[#C9A84C] relative inline-block">
                Adam International
              </span>
            </h2>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              We don’t just process application forms — we build global futures through personalized roadmaps, transparent guidance, and dedicated 1-on-1 mentorship.
            </p>

            {/* 3 Key Highlights with Rich Icon Containers */}
            <div className="pt-2 space-y-3.5">
              <div className="flex items-center gap-3.5 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <span className="text-sm font-bold text-[#0B1F3A]">100% Visa Approval Track Record</span>
              </div>

              <div className="flex items-center gap-3.5 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <span className="text-sm font-bold text-[#0B1F3A]">450+ Partner Universities Worldwide</span>
              </div>

              <div className="flex items-center gap-3.5 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <span className="text-sm font-bold text-[#0B1F3A]">Zero Hidden Charges & Full Transparency</span>
              </div>
            </div>

            {/* Rating / Trust Anchor Badge to balance height */}
            <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-md">
                  <Star className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#0B1F3A]">4.9 / 5.0 Student Rating</div>
                  <div className="text-xs text-slate-500 font-medium">Based on 15,000+ Placements</div>
                </div>
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3A] bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-2.5 py-1 rounded-full shrink-0">
                Top Rated
              </div>
            </div>

            {/* Prominent Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onConsultClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C9A84C] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white font-extrabold text-base py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl group cursor-pointer border border-[#C9A84C]"
              >
                <span>Book Free Counseling</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* ==========================================================================
              RIGHT COLUMN (60%): Interactive Feature Cards List
             ========================================================================== */}
          <div className="lg:col-span-7 space-y-5">
            {featuresData.map((feature) => {
              const IconComp = feature.icon;
              const isActive = activeCardId === feature.id;

              return (
                <div
                  key={feature.id}
                  ref={addCardRef}
                  onClick={() => handleCardClick(feature.id)}
                  className={`rounded-[20px] border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-50/30 via-white to-white border-[#C9A84C] shadow-[0_16px_36px_rgba(11,31,58,0.12)] ring-1 ring-[#C9A84C]/50 -translate-y-1' 
                      : 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(11,31,58,0.05)] hover:shadow-[0_16px_32px_rgba(11,31,58,0.1)] hover:border-[#C9A84C]/70 -translate-y-0 hover:-translate-y-1'
                  }`}
                >
                  <div className="p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    
                    {/* Thumbnail Image + Icon Header */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-200/80">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#0B1F3A]/25" />
                        <div className="absolute bottom-1.5 right-1.5 bg-[#0B1F3A] text-[#C9A84C] p-1.5 rounded-lg shadow-md">
                          <IconComp className="w-4 h-4 text-[#C9A84C]" />
                        </div>
                      </div>

                      {/* Title & Badge */}
                      <div>
                        <div className="inline-block bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#0B1F3A] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                          {feature.badge}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] leading-snug">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    {/* More Details Indicator */}
                    <div className="self-end sm:self-center shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-slate-100/80 border border-slate-200 px-3.5 py-2 rounded-xl group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors">
                      <span>{isActive ? 'Less Details' : 'More Details'}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-[#C9A84C]' : 'rotate-0 text-slate-500'
                        }`}
                      />
                    </div>

                  </div>

                  {/* Description Body */}
                  <div className="px-6 sm:px-7 pb-6">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                      {feature.description}
                    </p>

                    {/* Expandable Extended Details */}
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-amber-200/60 bg-amber-50/50 p-4 rounded-xl text-xs sm:text-sm text-[#0B1F3A] font-medium leading-relaxed flex items-start gap-2.5 animate-fadeIn">
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
