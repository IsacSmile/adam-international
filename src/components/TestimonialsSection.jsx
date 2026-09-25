import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, Heart, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonialsData = [
  {
    id: 'goladria-gomez',
    name: 'Goladria Gomez',
    role: 'MSc International Business',
    destination: 'United Kingdom 🇬🇧',
    quote: 'From start to finish, Adam International made my visa application a breeze. Their expertise and friendly guidance turned a complex process into a walk in the park. Grateful for their seamless service!',
    rating: 5,
    avatarBg: 'from-[#0B1F3A] to-indigo-900',
    initials: 'GG',
  },
  {
    id: 'marinda-dilendira',
    name: 'Marinda Dilendira',
    role: 'LLM Corporate Law',
    destination: 'United Kingdom 🇬🇧',
    quote: 'Adam International made my immigration journey stress-free. Their expertise and personalized guidance were remarkable, guiding me from application to approval. Now happily settled in the UK.',
    rating: 5,
    avatarBg: 'from-amber-600 to-[#0B1F3A]',
    initials: 'MD',
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Master of Data Science',
    destination: 'Canada 🇨🇦',
    quote: 'The guidance I received for university selection and financial documentation was outstanding. Adam International handled my application with extreme professionalism from day one.',
    rating: 5,
    avatarBg: 'from-slate-800 to-navy-deep',
    initials: 'MV',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // ==========================================================================
  // GSAP SCROLLTRIGGER ENTRANCE ANIMATION
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Elements Entrance
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

      // Stagger Testimonial Cards Entrance
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
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

  // Card Hover GSAP Animation
  const handleCardMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      y: -6,
      borderColor: '#C9A84C',
      boxShadow: '0 20px 35px rgba(11, 31, 58, 0.1)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const quoteIcon = e.currentTarget.querySelector('.quote-icon');
    if (quoteIcon) {
      gsap.to(quoteIcon, {
        color: '#C9A84C',
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCardMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: 'rgba(229, 231, 235, 1)',
      boxShadow: '0 4px 12px rgba(11, 31, 58, 0.03)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const quoteIcon = e.currentTarget.querySelector('.quote-icon');
    if (quoteIcon) {
      gsap.to(quoteIcon, {
        color: 'rgba(201, 168, 76, 0.3)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-white py-20 md:py-28 px-5 lg:px-8 relative overflow-hidden"
    >
      {/* Decorative Light Backdrop Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* SECTION HEADING */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-4 py-1.5 rounded-full text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Heart className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Client Love</span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight mb-4"
          >
            What Our Students Say
          </h2>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed"
          >
            Real stories from students who trusted us with their future.
          </p>

        </div>

        {/* TESTIMONIAL CARDS GRID (3 columns on desktop, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              ref={addCardRef}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              className="bg-[#F8F9FC] border border-gray-200 rounded-[16px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-colors shadow-sm relative group overflow-hidden"
            >
              {/* Top Decorative Gold Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C9A84C]" />

              <div>
                {/* Header: Large Light Gold Quotation Icon + Star Rating */}
                <div className="flex items-center justify-between mb-6">
                  <Quote className="quote-icon w-10 h-10 text-[#C9A84C]/30 transition-all duration-300 transform origin-left" />
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote Text */}
                <p className="text-gray-700 text-base leading-relaxed italic mb-8 font-normal">
                  "{item.quote}"
                </p>
              </div>

              {/* Student Info Footer */}
              <div className="pt-6 border-t border-gray-200/80 flex items-center gap-4">
                {/* Initials Avatar */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.avatarBg} text-white font-bold text-base flex items-center justify-center shadow-md shrink-0`}>
                  {item.initials}
                </div>

                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold text-[#0B1F3A] truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#C9A84C] font-semibold truncate">
                    {item.destination}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-normal">
                    {item.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
