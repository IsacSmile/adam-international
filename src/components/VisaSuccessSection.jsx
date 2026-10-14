import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { visaApprovals } from '../data/visaApprovals';
import VisaApprovalCard from './shared/VisaApprovalCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VisaSuccessSection() {
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

  // Sort by approvalDate descending and display the 6 most recent approvals
  const recentApprovals = [...visaApprovals]
    .sort((a, b) => new Date(b.approvalDate || 0) - new Date(a.approvalDate || 0))
    .slice(0, 6);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="recent-visa-approvals"
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
            <span>RECENT VISA APPROVALS</span>
          </div>

          {/* Main Title */}
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.16] mb-3.5"
          >
            Recent visa approvals
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed"
          >
            A few of the students who've recently got their visas with our help.
          </p>
        </div>

        {/* 6 MOST RECENT VISA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {recentApprovals.map((approval) => (
            <div key={approval.id} ref={addCardRef}>
              <VisaApprovalCard approval={approval} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
