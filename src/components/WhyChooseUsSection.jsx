import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Target, 
  ShieldCheck, 
  Award, 
  Globe, 
  Eye, 
  Users, 
  Sparkles 
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const featuresData = [
  {
    id: 'personalized-guidance',
    title: 'Personalized Guidance',
    description: 'Every student is unique. We create a customized roadmap based on your profile, goals, and budget.',
    icon: Target,
  },
  {
    id: 'end-to-end-support',
    title: 'End-to-End Support',
    description: 'From course selection to visa approval and post-landing assistance — we stay with you throughout the journey.',
    icon: ShieldCheck,
  },
  {
    id: 'high-visa-success',
    title: 'High Visa Success Rate',
    description: '100% visa success rate backed by expert documentation and interview preparation.',
    icon: Award,
  },
  {
    id: 'university-network',
    title: 'Strong University Network',
    description: 'Direct partnerships with 450+ universities across UK, Europe, USA, Canada, Australia and more.',
    icon: Globe,
  },
  {
    id: 'transparent-process',
    title: 'Transparent Process',
    description: 'No hidden charges. Clear communication and honest guidance at every step.',
    icon: Eye,
  },
  {
    id: 'experienced-team',
    title: 'Experienced Team',
    description: 'Since 2008, our expert counselors have helped thousands of students achieve their study abroad dreams.',
    icon: Users,
  },
];

export default function WhyChooseUsSection({ onConsultClick }) {
  const sectionRef = useRef(null);
  const patternRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Background Dot Pattern Parallax
      if (patternRef.current && !isMobile) {
        gsap.to(patternRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 2. Header Entrance
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

      // 3. Cards Stagger Entrance
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 35 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      y: -6,
      scale: 1.02,
      borderColor: '#C9A84C',
      boxShadow: '0 20px 35px rgba(11, 31, 58, 0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const iconBadge = e.currentTarget.querySelector('.feature-icon-badge');
    if (iconBadge) {
      gsap.to(iconBadge, {
        backgroundColor: '#C9A84C',
        color: '#0B1F3A',
        rotate: 5,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCardMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: 'rgba(229, 231, 235, 1)',
      boxShadow: '0 4px 12px rgba(11, 31, 58, 0.03)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const iconBadge = e.currentTarget.querySelector('.feature-icon-badge');
    if (iconBadge) {
      gsap.to(iconBadge, {
        backgroundColor: '#0B1F3A',
        color: '#C9A84C',
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="bg-[#F8F9FC] py-20 md:py-28 px-5 lg:px-8 border-t border-b border-gray-200/60 relative overflow-hidden"
    >
      {/* Decorative Dot Matrix Accent with Parallax */}
      <div
        ref={patternRef}
        className="absolute inset-0 bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none will-change-transform"
      />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* SECTION HEADING */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Why Us</span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-4"
          >
            Why Students Choose Adam International
          </h2>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed"
          >
            We don’t just process applications — we build futures.
          </p>

        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => {
            const IconComp = feature.icon;

            return (
              <div
                key={feature.id}
                ref={addCardRef}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                onClick={onConsultClick}
                className="bg-white border border-gray-200 rounded-[16px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#C9A84C]/10 to-transparent rounded-tr-[16px] pointer-events-none" />

                <div>
                  <div className="feature-icon-badge w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center mb-6 shadow-md transition-all duration-300">
                    <IconComp className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-snug">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                  <span>Adam Advantage</span>
                  <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
