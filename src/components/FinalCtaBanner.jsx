import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Phone, MessageSquare, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCtaBanner({ onBookCounseling }) {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Radial Glow Parallax Scrub
      if (glowRef.current && !isMobile) {
        gsap.to(glowRef.current, {
          yPercent: -25,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 2. Entrance Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(callRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrimaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#DFBE7A',
      scale: 1.03,
      boxShadow: '0 10px 30px rgba(201, 168, 76, 0.35)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handlePrimaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#C9A84C',
      scale: 1,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleSecondaryMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#FFFFFF',
      color: '#0B1F3A',
      borderColor: '#FFFFFF',
      scale: 1.03,
      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
      duration: 0.2,
      ease: 'power2.out',
    });

    const icon = e.currentTarget.querySelector('.whatsapp-icon');
    if (icon) {
      gsap.to(icon, { color: '#0B1F3A', duration: 0.2 });
    }
  };

  const handleSecondaryMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      scale: 1,
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.2,
      ease: 'power2.out',
    });

    const icon = e.currentTarget.querySelector('.whatsapp-icon');
    if (icon) {
      gsap.to(icon, { color: '#25D366', duration: 0.2 });
    }
  };

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-[#0B1F3A] via-[#112D53] to-[#0B1F3A] text-white py-16 md:py-20 px-5 lg:px-8 relative overflow-hidden border-t border-white/10"
    >
      {/* Background Decorative Gold Radial Overlay with Parallax */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none will-change-transform"
      />

      <div className="max-w-[1280px] mx-auto text-center relative z-10">

        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs font-semibold tracking-wider uppercase mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Start Your Journey</span>
        </div>

        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-5"
        >
          Ready to Architect Your Academic Future?
        </h2>

        <p
          ref={subtextRef}
          className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Book a free counseling session with our expert advisors and take the first step toward your dream university.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            type="button"
            onClick={onBookCounseling}
            onMouseEnter={handlePrimaryMouseEnter}
            onMouseLeave={handlePrimaryMouseLeave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] text-[#0B1F3A] font-bold text-base py-3.5 px-8 rounded-lg cursor-pointer transition-all shadow-md"
          >
            <span>Book Free Counseling</span>
            <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
          </button>

          <a
            href="https://wa.me/919895890500"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleSecondaryMouseEnter}
            onMouseLeave={handleSecondaryMouseLeave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-transparent border border-white/30 text-white font-medium text-base py-3.5 px-8 rounded-lg transition-all"
          >
            <MessageSquare className="whatsapp-icon w-4 h-4 text-[#25D366] transition-colors" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        <div ref={callRef} className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Or call us directly at <a href="tel:+919895890500" className="text-white hover:text-[#DFBE7A] underline font-semibold transition-colors">+91 9895 890 500</a></span>
        </div>

      </div>
    </section>
  );
}
