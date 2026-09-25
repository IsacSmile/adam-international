import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Phone, MessageSquare, Mail, GraduationCap } from 'lucide-react';

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
  // 2. FULL-SCREEN MOBILE OVERLAY GSAP ANIMATION & HAMBURGER MORPH
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobileOpen) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Animate Fullscreen Mobile Drawer
        gsap.to(mobileDrawerRef.current, {
          opacity: 1,
          y: '0%',
          visibility: 'visible',
          duration: 0.4,
          ease: 'power3.out'
        });

        // Stagger fade-up mobile links
        if (mobileLinksRef.current.length > 0) {
          gsap.fromTo(mobileLinksRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
          );
        }

        // Hamburger to X morph
        gsap.to(topBarRef.current, { y: 7, rotate: 45, duration: 0.3, ease: 'power2.out' });
        gsap.to(middleBarRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(bottomBarRef.current, { y: -7, rotate: -45, duration: 0.3, ease: 'power2.out' });

      } else {
        document.body.style.overflow = '';

        // Slide out Mobile Overlay
        gsap.to(mobileDrawerRef.current, {
          opacity: 0,
          y: '-100%',
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => {
            if (mobileDrawerRef.current) {
              gsap.set(mobileDrawerRef.current, { visibility: 'hidden' });
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
            <ul className="flex items-center gap-4 lg:gap-5 xl:gap-8 h-full">
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
              className="hidden lg:inline-flex items-center justify-center bg-[#0B1F3A] text-white font-medium text-[15px] px-[22px] py-[10px] rounded-lg border border-transparent cursor-pointer whitespace-nowrap shadow-sm leading-none transition-all duration-200"
            >
              <span>Book Appointment</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-11 h-11 rounded-lg text-[#0B1F3A] hover:bg-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A84C]"
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
          4. FULLSCREEN ULTRA-MODERN MOBILE OVERLAY MENU
         ========================================================================== */}
      <div
        ref={mobileDrawerRef}
        className="fixed inset-0 w-full h-dvh bg-[#0B1F3A] text-white z-50 flex flex-col justify-between p-6 sm:p-8 opacity-0 invisible -translate-y-full overflow-y-auto transition-none"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between max-w-md mx-auto w-full">
          
          {/* Top Bar: Brand Logo + Prominent Circular Close ('X') Button */}
          <div ref={addMobileLinkRef} className="flex items-center justify-between pb-5 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#C9A84C] bg-white flex items-center justify-center shadow-md">
                <img
                  src="/logo234.webp"
                  alt="Adam International Badge"
                  className="h-full w-auto object-cover object-left"
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">Adam International</h3>
                <p className="text-[11px] text-[#DFBE7A] font-medium">Study Abroad Consultancy</p>
              </div>
            </div>

            {/* Explicit Circular Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/25 text-white hover:bg-[#C9A84C] hover:text-[#0B1F3A] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-white hover:text-[#0B1F3A] transition-colors" />
            </button>
          </div>

          {/* Main Navigation Links */}
          <nav className="my-auto py-6">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isDropdown = !!link.dropdown;

                return (
                  <li key={link.name} ref={addMobileLinkRef}>
                    {!isDropdown ? (
                      <a
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-bold transition-all ${
                          link.active
                            ? 'bg-[#C9A84C] text-[#0B1F3A] shadow-lg'
                            : 'text-gray-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ArrowRight className={`w-4 h-4 ${link.active ? 'text-[#0B1F3A]' : 'opacity-40'}`} />
                      </a>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="w-full flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-bold text-gray-100 hover:bg-white/10 hover:text-white transition-all"
                          aria-expanded={mobileServicesOpen}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className={`w-5 h-5 text-[#DFBE7A] transition-transform duration-300 ${
                            mobileServicesOpen ? 'rotate-180 text-white' : ''
                          }`} />
                        </button>

                        {/* Submenu Accordion */}
                        {mobileServicesOpen && (
                          <ul className="pl-4 mt-2 space-y-1.5 border-l-2 border-[#C9A84C]/40">
                            {link.dropdown.map((subItem) => (
                              <li key={subItem.name}>
                                <a
                                  href={subItem.href}
                                  onClick={() => setIsMobileOpen(false)}
                                  className="flex items-center justify-between py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                >
                                  <span>{subItem.name}</span>
                                  {subItem.badge && (
                                    <span className="text-[10px] font-extrabold text-[#0B1F3A] bg-[#C9A84C] px-2 py-0.5 rounded-full">
                                      {subItem.badge}
                                    </span>
                                  )}
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
          </nav>

          {/* Quick Contact Info & Bottom CTA Button */}
          <div ref={addMobileLinkRef} className="pt-5 border-t border-white/15 space-y-4">
            
            {/* Direct Contact Bar */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-gray-200">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 bg-white/10 border border-white/15 p-2.5 rounded-xl hover:bg-white/20 transition-colors truncate"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <span className="truncate">+91 98765 43210</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-xl hover:bg-emerald-500/30 transition-colors truncate"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">WhatsApp Chat</span>
              </a>
            </div>

            {/* Premium Gold CTA Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                if (onBookAppointment) onBookAppointment();
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-[#C9A84C] text-[#0B1F3A] font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-xl hover:bg-[#DFBE7A] transition-all cursor-pointer active:scale-98"
            >
              <span>Book Free Counseling Session</span>
              <ArrowRight className="w-5 h-5 text-[#0B1F3A]" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

