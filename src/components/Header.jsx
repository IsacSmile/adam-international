import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

// Register GSAP Plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks = [
  { name: 'Home', href: '#home', active: true },
  { name: 'About Us', href: '#about' },
  { 
    name: 'Services', 
    href: '#services',
    dropdown: [
      { name: 'University Admissions', href: '#university-admissions', badge: 'Popular' },
      { name: 'Visa & Immigration Support', href: '#visa-assistance' },
      { name: 'Scholarship Guidance', href: '#scholarships' },
      { name: 'IELTS / PTE Test Prep', href: '#test-prep' },
      { name: 'Career & Course Mapping', href: '#career-counseling' },
    ]
  },
  { name: 'Countries', href: '#countries' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact Us', href: '#contact' },
];

export default function Header({ onBookAppointment }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for GSAP scoping
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const desktopCtaRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const mobileBackdropRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const topBarRef = useRef(null);
  const middleBarRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Helper to add refs into arrays
  const addNavRef = (el) => {
    if (el && !navItemsRef.current.includes(el)) {
      navItemsRef.current.push(el);
    }
  };

  const addMobileLinkRef = (el) => {
    if (el && !mobileLinksRef.current.includes(el)) {
      mobileLinksRef.current.push(el);
    }
  };

  // ==========================================================================
  // 1. GSAP INITIAL ENTRY ANIMATIONS & SCROLL TRIGGER SHADOW
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for Page Load Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Logo fade in
      if (logoRef.current) {
        tl.fromTo(logoRef.current, 
          { opacity: 0, x: -15 }, 
          { opacity: 1, x: 0, duration: 0.6 }
        );
      }

      // 2. Desktop Nav items stagger from top
      if (navItemsRef.current.length > 0) {
        tl.fromTo(navItemsRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          '-=0.4'
        );
      }

      // 3. CTA Button fade in
      if (desktopCtaRef.current) {
        tl.fromTo(desktopCtaRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4 },
          '-=0.3'
        );
      }

      // ScrollTrigger for smooth Sticky Shadow transition
      ScrollTrigger.create({
        start: 'top -10px',
        onUpdate: (self) => {
          const scrolled = self.scroll() > 10;
          setIsScrolled(scrolled);
          gsap.to(headerRef.current, {
            boxShadow: scrolled ? '0 4px 20px rgba(11, 31, 58, 0.08)' : '0 0px 0px rgba(0,0,0,0)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // ==========================================================================
  // 2. MOBILE DRAWER GSAP ANIMATION & HAMBURGER MORPH
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobileOpen) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Animate Drawer Backdrop
        gsap.to(mobileBackdropRef.current, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.3,
          ease: 'power2.out'
        });

        // Slide in Mobile Drawer
        gsap.to(mobileDrawerRef.current, {
          x: '0%',
          visibility: 'visible',
          duration: 0.4,
          ease: 'power3.out'
        });

        // Stagger fade-up mobile links
        if (mobileLinksRef.current.length > 0) {
          gsap.fromTo(mobileLinksRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
          );
        }

        // Hamburger to X morph
        gsap.to(topBarRef.current, { y: 7, rotate: 45, duration: 0.3, ease: 'power2.out' });
        gsap.to(middleBarRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(bottomBarRef.current, { y: -7, rotate: -45, duration: 0.3, ease: 'power2.out' });

      } else {
        document.body.style.overflow = '';

        // Slide out Mobile Drawer
        gsap.to(mobileDrawerRef.current, {
          x: '100%',
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => {
            if (mobileDrawerRef.current) {
              gsap.set(mobileDrawerRef.current, { visibility: 'hidden' });
            }
          }
        });

        // Fade out Backdrop
        gsap.to(mobileBackdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            if (mobileBackdropRef.current) {
              gsap.set(mobileBackdropRef.current, { visibility: 'hidden' });
            }
          }
        });

        // Reset Hamburger Icon
        gsap.to(topBarRef.current, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(middleBarRef.current, { opacity: 1, duration: 0.2 });
        gsap.to(bottomBarRef.current, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
      }
    });

    return () => ctx.revert();
  }, [isMobileOpen]);

  // Handle Nav Underline Hover Animation with GSAP
  const handleMouseEnterUnderline = (e) => {
    const underline = e.currentTarget.querySelector('.gsap-underline');
    if (underline) {
      gsap.to(underline, { scaleX: 1, transformOrigin: 'left', duration: 0.25, ease: 'power2.out' });
    }
  };

  const handleMouseLeaveUnderline = (e, isActive) => {
    const underline = e.currentTarget.querySelector('.gsap-underline');
    if (underline && !isActive) {
      gsap.to(underline, { scaleX: 0, transformOrigin: 'right', duration: 0.25, ease: 'power2.out' });
    }
  };

  // CTA Button GSAP Hover effect
  const handleCtaMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#071426',
      borderColor: '#C9A84C',
      scale: 1.02,
      boxShadow: '0 6px 16px rgba(11, 31, 58, 0.25)',
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleCtaMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#0B1F3A',
      borderColor: 'transparent',
      scale: 1,
      boxShadow: '0 2px 6px rgba(11, 31, 58, 0.12)',
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-colors duration-200 ${
          isScrolled ? 'border-gray-200/80' : 'border-gray-200'
        }`}
      >
        <div className="max-w-[1280px] h-[64px] lg:h-[72px] mx-auto px-5 lg:px-8 flex items-center justify-between">
          
          {/* ==========================================================================
              1. LOGO: Desktop Full Logo, Mobile Circular Badge Only
             ========================================================================== */}
          <a
            href="#home"
            ref={logoRef}
            className="flex items-center group rounded-md outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A84C]"
            aria-label="Adam International Study Abroad Home"
          >
            {/* 
              Mobile: Container is 44px x 44px overflow-hidden showing left badge only.
              Desktop (lg): Container width auto, height 52px showing badge + text.
            */}
            <div className="h-[44px] w-[44px] lg:h-[52px] lg:w-auto overflow-hidden flex items-center justify-start transition-all duration-300">
              <img
                src="/logo234.webp"
                alt="Adam International Study Abroad Badge & Logo"
                className="h-[44px] lg:h-[52px] w-auto max-w-none object-cover object-left block"
              />
            </div>
          </a>

          {/* ==========================================================================
              2. DESKTOP NAVIGATION
             ========================================================================== */}
          <nav className="hidden lg:flex items-center h-full" aria-label="Desktop Navigation">
            <ul className="flex items-center gap-7 lg:gap-9 h-full">
              {navLinks.map((link, idx) => {
                const isDropdown = !!link.dropdown;

                return (
                  <li
                    key={link.name}
                    ref={addNavRef}
                    className="relative flex items-center h-full group"
                    onMouseEnter={() => isDropdown && setActiveDropdown(true)}
                    onMouseLeave={() => isDropdown && setActiveDropdown(false)}
                  >
                    <a
                      href={link.href}
                      onMouseEnter={handleMouseEnterUnderline}
                      onMouseLeave={(e) => handleMouseLeaveUnderline(e, link.active)}
                      className={`relative flex items-center gap-1.5 h-full text-[15px] font-medium transition-colors duration-200 outline-none ${
                        link.active ? 'text-[#0B1F3A] font-semibold' : 'text-[#1A1A2E] hover:text-[#0B1F3A]'
                      }`}
                      aria-haspopup={isDropdown ? 'true' : undefined}
                      aria-expanded={isDropdown ? activeDropdown : undefined}
                    >
                      <span>{link.name}</span>

                      {isDropdown && (
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                          activeDropdown ? 'rotate-180 text-[#0B1F3A]' : 'group-hover:rotate-180'
                        }`} />
                      )}

                      {/* GSAP Underline element */}
                      <span
                        className="gsap-underline absolute bottom-[18px] left-0 w-full h-[2px] bg-[#C9A84C] pointer-events-none"
                        style={{
                          transform: link.active ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: link.active ? 'left' : 'right'
                        }}
                      />
                    </a>

                    {/* Services Dropdown Menu */}
                    {isDropdown && (
                      <div
                        className={`absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[260px] bg-white border border-gray-200 border-t-[3px] border-t-[#C9A84C] rounded-b-xl shadow-dropdown py-2 transition-all duration-200 z-50 ${
                          activeDropdown
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                        role="menu"
                        aria-label="Services Submenu"
                      >
                        {link.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center justify-between px-4 py-2.5 text-[14px] font-medium text-[#1A1A2E] hover:text-[#0B1F3A] hover:bg-navy-deep/5 transition-colors"
                            role="menuitem"
                          >
                            <span>{subItem.name}</span>
                            {subItem.badge && (
                              <span className="text-[11px] font-semibold text-[#0B1F3A] bg-[#C9A84C]/20 px-2 py-0.5 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ==========================================================================
              3. CTA BUTTON (Desktop) & MOBILE HAMBURGER TOGGLE
             ========================================================================== */}
          <div className="flex items-center gap-4">
            
            {/* Desktop CTA Button */}
            <button
              ref={desktopCtaRef}
              onClick={onBookAppointment}
              onMouseEnter={handleCtaMouseEnter}
              onMouseLeave={handleCtaMouseLeave}
              className="hidden lg:inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-medium text-[15px] py-2.5 px-5.5 rounded-lg border border-transparent cursor-pointer whitespace-nowrap shadow-sm"
            >
              <span>Book Appointment</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-11 h-11 rounded-lg text-[#0B1F3A] hover:bg-navy-deep/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A84C]"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span ref={topBarRef} className="w-full h-[2.25px] bg-[#0B1F3A] rounded-full block transform origin-center"></span>
                <span ref={middleBarRef} className="w-full h-[2.25px] bg-[#0B1F3A] rounded-full block"></span>
                <span ref={bottomBarRef} className="w-full h-[2.25px] bg-[#0B1F3A] rounded-full block transform origin-center"></span>
              </div>
            </button>

          </div>

        </div>
      </header>

      {/* ==========================================================================
          4. MOBILE DRAWER & BACKDROP (GSAP Animated)
         ========================================================================== */}
      <div
        ref={mobileBackdropRef}
        onClick={() => setIsMobileOpen(false)}
        className="fixed inset-0 bg-[#0B1F3A]/40 backdrop-blur-sm z-40 opacity-0 invisible transition-none"
        aria-hidden="true"
      />

      <div
        ref={mobileDrawerRef}
        className="fixed top-0 right-0 w-full max-w-[340px] h-dvh bg-white z-50 flex flex-col pt-[72px] pb-8 px-6 shadow-drawer translate-x-full invisible overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <ul className="flex flex-col gap-1 mb-8">
          {navLinks.map((link) => {
            const isDropdown = !!link.dropdown;

            return (
              <li key={link.name} ref={addMobileLinkRef}>
                {!isDropdown ? (
                  <a
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-lg text-[16px] font-medium transition-colors ${
                      link.active 
                        ? 'text-[#0B1F3A] font-semibold bg-[#C9A84C]/10 border-l-4 border-[#C9A84C]' 
                        : 'text-[#1A1A2E] hover:bg-navy-deep/5 hover:text-[#0B1F3A]'
                    }`}
                  >
                    <span>{link.name}</span>
                  </a>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between p-3 rounded-lg text-[16px] font-medium text-[#1A1A2E] hover:bg-navy-deep/5 hover:text-[#0B1F3A] transition-colors"
                      aria-expanded={mobileServicesOpen}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-[#0B1F3A]' : ''
                      }`} />
                    </button>

                    {/* Submenu Accordion */}
                    {mobileServicesOpen && (
                      <ul className="pl-4 mt-1 mb-2 border-l-2 border-gray-200 flex flex-col gap-1">
                        {link.dropdown.map((subItem) => (
                          <li key={subItem.name}>
                            <a
                              href={subItem.href}
                              onClick={() => setIsMobileOpen(false)}
                              className="block px-3 py-2 text-[15px] text-gray-600 hover:text-[#0B1F3A] hover:bg-navy-deep/5 rounded-md transition-colors"
                            >
                              {subItem.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile CTA Button */}
        <div ref={addMobileLinkRef} className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsMobileOpen(false);
              if (onBookAppointment) onBookAppointment();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#0B1F3A] text-white font-semibold text-[16px] py-3 px-6 rounded-lg shadow-md hover:bg-navy-dark transition-colors"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
