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
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop',
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
          { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 },
          {
            opacity: 1,
            x: 0,
            y: 0,
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
          { opacity: 0, y: 30 },
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

        // 3. Active Card Highlight Syncing on Scroll (Desktop only to avoid touch layout shifts)
        if (!isMobile) {
          cardsListRef.current.forEach((cardEl, index) => {
            if (!cardEl) return;
            ScrollTrigger.create({
              trigger: cardEl,
              start: 'top 60%',
              end: 'bottom 40%',
              onEnter: () => setActiveCardId(featuresData[index].id),
              onEnterBack: () => setActiveCardId(featuresData[index].id),
            });
          });
        }
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
      className="bg-[#F8FAFC] py-16 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 relative overflow-x-clip border-t border-b border-slate-200/80"
    >
      {/* Soft Ambient Glow Accents */}
      <div className="absolute top-0 right-0 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-br from-[#C9A84C]/10 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-[#0B1F3A]/8 via-[#C9A84C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 xl:gap-24 items-start relative">
          
          {/* ==========================================================================
              LEFT COLUMN (40%): Sticky Pinned Content Area
             ========================================================================== */}
          <div
            ref={leftStickyRef}
            className="lg:col-span-5 lg:sticky lg:top-28 text-left space-y-6 sm:space-y-8 lg:space-y-9 self-start"
          >
            {/* Small Gold Pill Badge */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 px-3.5 sm:px-4 py-1.5 rounded-full text-[#0B1F3A] text-[11px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>WHY US</span>
              </div>
            </div>

            {/* Main Heading & Description */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.18]">
                Why Students Choose{' '}
                <span className="text-[#C9A84C] relative inline-block">
                  Adam International
                </span>
              </h2>

              <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
                We don’t just process application forms — we build global futures through personalized roadmaps, transparent guidance, and dedicated 1-on-1 mentorship.
              </p>
            </div>

            {/* 3 Key Highlights with Generous Padding */}
            <div className="pt-1 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3.5 sm:gap-4 bg-white p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A84C]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">100% Visa Approval Track Record</span>
              </div>

              <div className="flex items-center gap-3.5 sm:gap-4 bg-white p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A84C]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">450+ Partner Universities Worldwide</span>
              </div>

              <div className="flex items-center gap-3.5 sm:gap-4 bg-white p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A84C]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">Zero Hidden Charges & Full Transparency</span>
              </div>
            </div>

            {/* Trust Anchor Rating Badge */}
            <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shrink-0 shadow-md">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#C9A84C] text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#0B1F3A]">4.9 / 5.0 Student Rating</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Based on 15,000+ Placements</div>
                </div>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#0B1F3A] bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shrink-0">
                Top Rated
              </div>
            </div>

            {/* Prominent Action Button with Extra Space */}
            <div className="pt-2 sm:pt-4">
              <button
                type="button"
                onClick={onConsultClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C9A84C] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white font-extrabold text-sm sm:text-base py-3.5 sm:py-4.5 px-7 sm:px-9 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl group cursor-pointer border border-[#C9A84C]"
              >
                <span>Book Free Counseling</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* ==========================================================================
              RIGHT COLUMN (60%): Feature Cards Stack
             ========================================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-8">
            {featuresData.map((feature) => {
              const IconComp = feature.icon;
              const isActive = activeCardId === feature.id;

              return (
                <div
                  key={feature.id}
                  ref={addCardRef}
                  onClick={() => handleCardClick(feature.id)}
                  className={`rounded-2xl sm:rounded-[24px] border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-50/40 via-white to-white border-[#C9A84C] shadow-[0_16px_36px_rgba(11,31,58,0.12)] ring-1 ring-[#C9A84C]/50 -translate-y-0.5 sm:-translate-y-1' 
                      : 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(11,31,58,0.04)] hover:shadow-[0_16px_32px_rgba(11,31,58,0.1)] hover:border-[#C9A84C]/70 -translate-y-0 hover:-translate-y-1'
                  }`}
                >
                  <div className="p-5 sm:p-9 lg:p-10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                    
                    {/* Thumbnail Image + Icon Header */}
                    <div className="flex items-center gap-3.5 sm:gap-5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center gap-3.5 sm:gap-5">
                        <div className="relative w-14 h-14 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-200/80 bg-slate-100">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop';
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-[#0B1F3A]/20" />
                          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-[#0B1F3A] text-[#C9A84C] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md">
                            <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A84C]" />
                          </div>
                        </div>

                        {/* Title & Badge */}
                        <div className="space-y-1">
                          <div className="inline-block bg-[#C9A84C]/15 border border-[#C9A84C]/35 text-[#0B1F3A] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider">
                            {feature.badge}
                          </div>
                          <h3 className="text-base sm:text-2xl font-bold text-[#0B1F3A] leading-snug">
                            {feature.title}
                          </h3>
                        </div>
                      </div>

                      {/* Mobile More Details Indicator (Inline Right) */}
                      <div className="sm:hidden shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#0B1F3A] bg-slate-100/90 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                        <span>{isActive ? 'Less' : 'More'}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            isActive ? 'rotate-90 text-[#C9A84C]' : 'rotate-0 text-slate-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Desktop More Details Indicator */}
                    <div className="hidden sm:flex self-center shrink-0 items-center gap-2 text-xs font-bold text-[#0B1F3A] bg-slate-100/90 border border-slate-200 px-4 py-2.5 rounded-xl group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors">
                      <span>{isActive ? 'Less Details' : 'More Details'}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-[#C9A84C]' : 'rotate-0 text-slate-500'
                        }`}
                      />
                    </div>

                  </div>

                  {/* Description Body */}
                  <div className="px-5 sm:px-9 lg:px-10 pb-5 sm:pb-9 lg:pb-10">
                    <p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-normal">
                      {feature.description}
                    </p>

                    {/* Smooth Expandable Extended Details Drawer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isActive 
                          ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-amber-200/60' 
                          : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'
                      }`}
                    >
                      <div className="bg-amber-50/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-xs sm:text-base text-[#0B1F3A] font-medium leading-relaxed flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                        <span>{feature.extendedDetail}</span>
                      </div>
                    </div>
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
