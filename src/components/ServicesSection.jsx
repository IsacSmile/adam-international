import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Compass, 
  GraduationCap, 
  Landmark, 
  FileText, 
  Luggage, 
  Award,
  ArrowRight
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const servicesData = [
  {
    id: 'career-counseling',
    title: 'Career Counseling',
    description: 'Personalized guidance to choose the perfect course and destination that matches your goals and profile.',
    icon: Compass,
  },
  {
    id: 'admission-support',
    title: 'Admission Support',
    description: 'End-to-end assistance with university applications, documentation, and admission process.',
    icon: GraduationCap,
  },
  {
    id: 'financial-assistance',
    title: 'Financial & Loan Assistance',
    description: 'Help with education loans, scholarships, and financial planning for studying abroad.',
    icon: Landmark,
  },
  {
    id: 'visa-assistance',
    title: 'Documentation & Visa Assistance',
    description: 'Complete support for visa documentation, interview preparation, and application filing.',
    icon: FileText,
  },
  {
    id: 'pre-departure',
    title: 'Pre-Departure & Post-Landing',
    description: 'Travel arrangements, airport pickup guidance, accommodation support, and settling assistance.',
    icon: Luggage,
  },
  {
    id: 'training-interview',
    title: 'Training & Interview Prep',
    description: 'IELTS/PTE training, visa interview preparation, and soft skills development.',
    icon: Award,
  },
];

export default function ServicesSection({ onSelectService }) {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // ==========================================================================
  // GSAP SCROLLTRIGGER STAGGER FADE-UP ANIMATION
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Text Animation
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
          duration: 0.8,
          stagger: 0.12,
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

  // GSAP Hover Handlers for Cards
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      y: -6,
      scale: 1.02,
      borderColor: '#C9A84C',
      boxShadow: '0 20px 35px rgba(11, 31, 58, 0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });
    
    // Animate Icon inside
    const iconContainer = e.currentTarget.querySelector('.service-icon-bg');
    if (iconContainer) {
      gsap.to(iconContainer, {
        backgroundColor: '#C9A84C',
        color: '#0B1F3A',
        rotate: 5,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      borderColor: 'rgba(229, 231, 235, 1)',
      boxShadow: '0 4px 12px rgba(11, 31, 58, 0.04)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const iconContainer = e.currentTarget.querySelector('.service-icon-bg');
    if (iconContainer) {
      gsap.to(iconContainer, {
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
      id="services" 
      ref={sectionRef} 
      className="bg-[#F8F9FC] py-20 md:py-28 px-5 lg:px-8 border-t border-b border-gray-200/60 relative overflow-hidden"
    >
      {/* Decorative Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* SECTION HEADING */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          
          <div 
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <span>Our Expertise</span>
          </div>

          <h2 
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-4"
          >
            Complete Support for Your Study Abroad Journey
          </h2>

          <p 
            ref={subtitleRef}
            className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed"
          >
            From choosing the right course to settling in your dream country — we handle everything.
          </p>

        </div>

        {/* SERVICES GRID (3 columns desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const IconComponent = service.icon;

            return (
              <div
                key={service.id}
                ref={addCardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelectService && onSelectService(service)}
                className="bg-white border border-gray-200 rounded-[16px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm relative group overflow-hidden"
              >
                {/* Accent Corner Bar */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C9A84C]/10 to-transparent rounded-tr-[16px] pointer-events-none" />

                <div>
                  {/* Top Icon Badge (Navy + Gold Style) */}
                  <div className="service-icon-bg w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center mb-6 shadow-md transition-all duration-300">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-snug">
                    {service.title}
                  </h3>

                  {/* Muted Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors pt-4 border-t border-gray-100">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
