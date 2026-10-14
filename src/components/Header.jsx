import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  GraduationCap,
  Compass,
  BookOpenCheck,
  Wallet,
  FileCheck2,
  Plane,
  Luggage,
} from 'lucide-react';
import { services } from '../data/services';
import { useAppointment } from '../context/AppointmentContext';

// Register GSAP Plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  Compass,
  GraduationCap,
  BookOpenCheck,
  Wallet,
  FileCheck2,
  Plane,
  Luggage,
};

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/#about' }, // TODO: page not built yet
  {
    name: 'Services',
    href: '/services',
    isDropdown: true,
  },
  { name: 'Countries', href: '/countries' },
  { name: 'Gallery', href: '/#gallery' }, // TODO: page not built yet
  { name: 'Blog', href: '/#blog' }, // TODO: page not built yet
  { name: 'Contact Us', href: '/#contact' },
];

export default function Header({ onBookAppointment }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const { openAppointment } = useAppointment();

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment();
    } else {
      openAppointment();
    }
  };

  // Refs for GSAP scoping & dropdown outside click
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const desktopCtaRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const topBarRef = useRef(null);
  const middleBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Close desktop dropdown on Outside Click and Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(false);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown]);

  // Determine active state based on route
  const isLinkActive = (link) => {
    if (link.isDropdown) {
      return location.pathname.startsWith('/services');
    }
    if (link.href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (link.href.startsWith('/#')) {
      const targetHash = link.href.slice(1);
      return location.pathname === '/' && location.hash === targetHash;
    }
    return location.pathname === link.href;
  };

  // ==========================================================================
  // 1. GSAP INITIAL ENTRY ANIMATIONS & SCROLL TRIGGER SHADOW
  // ==========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.6 }
        );
      }

      if (navItemsRef.current.length > 0) {
        tl.fromTo(
          navItemsRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          '-=0.4'
        );
      }

      if (desktopCtaRef.current) {
        tl.fromTo(
          desktopCtaRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4 },
          '-=0.3'
        );
      }

      ScrollTrigger.create({
        start: 'top -10px',
        onUpdate: (self) => {
          const scrolled = self.scroll() > 10;
          setIsScrolled(scrolled);
          gsap.to(headerRef.current, {
            boxShadow: scrolled ? '0 4px 20px rgba(11, 31, 58, 0.08)' : '0 0px 0px rgba(0,0,0,0)',
            duration: 0.3,
            ease: 'power2.out',
          });
        },
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
        document.body.style.overflow = 'hidden';

        gsap.to(mobileDrawerRef.current, {
          opacity: 1,
          y: '0%',
          visibility: 'visible',
          duration: 0.4,
          ease: 'power3.out',
        });

        if (mobileLinksRef.current.length > 0) {
          gsap.fromTo(
            mobileLinksRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
          );
        }

        gsap.to(topBarRef.current, { y: 7, rotate: 45, duration: 0.3, ease: 'power2.out' });
        gsap.to(middleBarRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(bottomBarRef.current, { y: -7, rotate: -45, duration: 0.3, ease: 'power2.out' });
      } else {
        document.body.style.overflow = '';

        gsap.to(mobileDrawerRef.current, {
          opacity: 0,
          y: '-100%',
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => {
            if (mobileDrawerRef.current) {
              gsap.set(mobileDrawerRef.current, { visibility: 'hidden' });
            }
          },
        });

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
      ease: 'power2.out',
    });
  };

  const handleCtaMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: '#0B1F3A',
      borderColor: 'transparent',
      scale: 1,
      boxShadow: '0 2px 6px rgba(11, 31, 58, 0.12)',
      duration: 0.2,
      ease: 'power2.out',
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
          <Link
            to="/"
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
          </Link>

          {/* ==========================================================================
              2. DESKTOP NAVIGATION
             ========================================================================== */}
          <nav className="hidden lg:flex items-center h-full" aria-label="Desktop Navigation">
            <ul className="flex items-center gap-4 lg:gap-5 xl:gap-8 h-full">
              {navLinks.map((link) => {
                const isDropdown = !!link.isDropdown;
                const active = isLinkActive(link);

                return (
                  <li
                    key={link.name}
                    ref={isDropdown ? dropdownRef : addNavRef}
                    className="relative flex items-center h-full group"
                    onMouseEnter={() => isDropdown && setActiveDropdown(true)}
                    onMouseLeave={() => isDropdown && setActiveDropdown(false)}
                  >
                    {isDropdown ? (
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(!activeDropdown)}
                        onMouseEnter={handleMouseEnterUnderline}
                        onMouseLeave={(e) => handleMouseLeaveUnderline(e, active)}
                        className={`relative flex items-center gap-1.5 h-full text-[15px] font-medium transition-colors duration-200 outline-none cursor-pointer bg-transparent border-none ${
                          active ? 'text-[#0B1F3A] font-semibold' : 'text-[#1A1A2E] hover:text-[#0B1F3A]'
                        }`}
                        aria-haspopup="true"
                        aria-expanded={activeDropdown}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                            activeDropdown ? 'rotate-180 text-[#0B1F3A]' : 'group-hover:rotate-180'
                          }`}
                        />
                        {/* GSAP Underline element */}
                        <span
                          className="gsap-underline absolute bottom-[18px] left-0 w-full h-[2px] bg-[#C9A84C] pointer-events-none"
                          style={{
                            transform: active ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: active ? 'left' : 'right',
                          }}
                        />
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        onMouseEnter={handleMouseEnterUnderline}
                        onMouseLeave={(e) => handleMouseLeaveUnderline(e, active)}
                        className={`relative flex items-center gap-1.5 h-full text-[15px] font-medium transition-colors duration-200 outline-none ${
                          active ? 'text-[#0B1F3A] font-semibold' : 'text-[#1A1A2E] hover:text-[#0B1F3A]'
                        }`}
                      >
                        <span>{link.name}</span>
                        {/* GSAP Underline element */}
                        <span
                          className="gsap-underline absolute bottom-[18px] left-0 w-full h-[2px] bg-[#C9A84C] pointer-events-none"
                          style={{
                            transform: active ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: active ? 'left' : 'right',
                          }}
                        />
                      </Link>
                    )}

                    {/* Desktop Services Dropdown Menu */}
                    {isDropdown && (
                      <div
                        className={`absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[310px] bg-white border border-gray-200 border-t-[3px] border-t-[#C9A84C] rounded-b-xl shadow-2xl py-2 transition-all duration-200 z-50 ${
                          activeDropdown
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                        role="menu"
                        aria-label="Services Submenu"
                      >
                        {services.map((service) => {
                          const IconComponent = iconMap[service.icon] || Compass;
                          return (
                            <Link
                              key={service.slug}
                              to={`/services/${service.slug}`}
                              onClick={() => setActiveDropdown(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 text-[14px] font-medium text-[#1A1A2E] hover:text-[#0B1F3A] hover:bg-slate-50 transition-colors rounded-lg mx-1"
                              role="menuitem"
                            >
                              <div className="w-7 h-7 rounded-md bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
                                <IconComponent className="w-4 h-4 text-[#C9A84C]" />
                              </div>
                              <span className="truncate">{service.title}</span>
                            </Link>
                          );
                        })}

                        <div className="border-t border-gray-100 mt-1 pt-1.5">
                          <Link
                            to="/services"
                            onClick={() => setActiveDropdown(false)}
                            className="flex items-center justify-between px-4 py-2 text-[13px] font-bold text-[#0B1F3A] hover:text-[#C9A84C] hover:bg-slate-50 transition-colors rounded-lg mx-1"
                            role="menuitem"
                          >
                            <span>All Services →</span>
                            <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                          </Link>
                        </div>
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
              onClick={handleBookAppointment}
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
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3">
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
            </Link>

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
                const isDropdown = !!link.isDropdown;
                const active = isLinkActive(link);

                return (
                  <li key={link.name} ref={addMobileLinkRef}>
                    {!isDropdown ? (
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-bold transition-all ${
                          active
                            ? 'bg-[#C9A84C] text-[#0B1F3A] shadow-lg'
                            : 'text-gray-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ArrowRight className={`w-4 h-4 ${active ? 'text-[#0B1F3A]' : 'opacity-40'}`} />
                      </Link>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="w-full flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-bold text-gray-100 hover:bg-white/10 hover:text-white transition-all"
                          aria-expanded={mobileServicesOpen}
                        >
                          <span className={active ? 'text-[#DFBE7A]' : ''}>{link.name}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#DFBE7A] transition-transform duration-300 ${
                              mobileServicesOpen ? 'rotate-180 text-white' : ''
                            }`}
                          />
                        </button>

                        {/* Submenu Accordion */}
                        {mobileServicesOpen && (
                          <ul className="pl-4 mt-2 space-y-1.5 border-l-2 border-[#C9A84C]/40">
                            {services.map((service) => {
                              const IconComponent = iconMap[service.icon] || Compass;
                              return (
                                <li key={service.slug}>
                                  <Link
                                    to={`/services/${service.slug}`}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex items-center gap-2.5 py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                  >
                                    <IconComponent className="w-4 h-4 text-[#C9A84C] shrink-0" />
                                    <span>{service.title}</span>
                                  </Link>
                                </li>
                              );
                            })}
                            <li>
                              <Link
                                to="/services"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center justify-between py-2 px-3 text-sm font-bold text-[#DFBE7A] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                              >
                                <span>All Services →</span>
                              </Link>
                            </li>
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
                href="tel:+919895890500"
                className="flex items-center gap-2 bg-white/10 border border-white/15 p-2.5 rounded-xl hover:bg-white/20 transition-colors truncate"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <span className="truncate">+91 9895 890 500</span>
              </a>
              <a
                href="https://wa.me/919895890500"
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
                handleBookAppointment();
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
