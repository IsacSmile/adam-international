import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Play,
  Calendar,
  MapPin,
  Building2,
  Images,
} from 'lucide-react';
import WhatsAppIcon from '../components/shared/WhatsAppIcon';
import Breadcrumb from '../components/shared/Breadcrumb';
import Lightbox from '../components/shared/Lightbox';
import { galleryItems, galleryTypes } from '../data/gallery';
import { countries } from '../data/countries';
import { SHOW_PLACEHOLDERS } from '../lib/contentFlags';
import { whatsappLink } from '../data/contact';
import { useAppointment } from '../context/AppointmentContext';
import { useLenis } from '../components/SmoothScroll';

// Format 'YYYY-MM-DD' or 'YYYY-MM' to 'Oct 2026'
function formatGalleryDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Sort items: featured first, then newest date first
function sortGalleryItems(items) {
  return [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });
}

export default function GalleryPage() {
  const { openAppointment } = useAppointment();
  const lenis = useLenis();
  const pageRef = useRef(null);

  // Active section for sticky category tabs
  const [activeTab, setActiveTab] = useState('visa-success');

  // Filter chips for events category
  const [selectedEventType, setSelectedEventType] = useState('All');

  // Show more pagination (9 items per step)
  const [visaLimit, setVisaLimit] = useState(9);
  const [eventsLimit, setEventsLimit] = useState(9);
  const [studentLifeLimit, setStudentLifeLimit] = useState(9);

  // Lightbox state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    items: [],
    index: 0,
  });

  const availableGalleryItems = useMemo(() => {
    return SHOW_PLACEHOLDERS
      ? (galleryItems || [])
      : (galleryItems || []).filter((item) => !item.isPlaceholder);
  }, []);

  // Filter items by category & consent rules
  const visaItems = useMemo(() => {
    const filtered = availableGalleryItems.filter(
      (item) => item.category === 'visa' && item.consentOnFile === true
    );
    return sortGalleryItems(filtered);
  }, [availableGalleryItems]);

  const eventItems = useMemo(() => {
    const filtered = availableGalleryItems.filter(
      (item) => item.category === 'events'
    );
    return sortGalleryItems(filtered);
  }, [availableGalleryItems]);

  const studentLifeItems = useMemo(() => {
    const filtered = availableGalleryItems.filter((item) => {
      if (item.category !== 'student-life') return false;
      // Items of type 'Student life in Europe' or 'Student send-off' render only when consentOnFile: true
      if (
        item.type === 'Student life in Europe' ||
        item.type === 'Student send-off'
      ) {
        return item.consentOnFile === true;
      }
      return true;
    });
    return sortGalleryItems(filtered);
  }, [availableGalleryItems]);

  // Events filtered by chip
  const filteredEventItems = useMemo(() => {
    if (selectedEventType === 'All') return eventItems;
    return eventItems.filter((item) => item.type === selectedEventType);
  }, [eventItems, selectedEventType]);

  // Event types that have at least one item
  const availableEventTypes = useMemo(() => {
    const counts = {};
    eventItems.forEach((item) => {
      if (item.type) {
        counts[item.type] = (counts[item.type] || 0) + 1;
      }
    });
    const types = (galleryTypes?.events || []).filter((t) => Boolean(counts[t]));
    return types;
  }, [eventItems]);

  const hasAnyItems =
    visaItems.length > 0 || eventItems.length > 0 || studentLifeItems.length > 0;

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    } else {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // IntersectionObserver to update active tab on scroll
  useEffect(() => {
    if (!hasAnyItems) return;

    const sections = ['visa-success', 'events', 'student-life']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [hasAnyItems]);

  // GSAP animation with cleanup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {}, pageRef);
    return () => ctx.revert();
  }, []);

  const openLightbox = (items, index) => {
    setLightboxState({
      isOpen: true,
      items,
      index,
    });
  };

  const closeLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const setLightboxIndex = (index) => {
    setLightboxState((prev) => ({ ...prev, index }));
  };

  return (
    <div ref={pageRef} className="bg-white">
      <Helmet>
        <title>Gallery | Adam International</title>
        <meta
          name="description"
          content="Student visa successes, university events and pre-departure moments from Adam International."
        />
      </Helmet>

      {/* =========================================================================
          3.1 HERO SECTION (Full-width hero style from About page)
      ========================================================================= */}
      <section className="relative w-full min-h-[520px] lg:min-h-[580px] flex items-center bg-[#0B1F3A] overflow-hidden pt-28 pb-16 lg:py-28">
        {/* Background Image: /images/about/hero.jpg */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/hero.jpg"
            alt="European campus view"
            className="w-full h-full object-cover object-center"
          />
          {/* Navy Gradient Overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/40 pointer-events-none" />
        </div>

        {/* Ambient glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Breadcrumb: Home / Gallery */}
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
              className="mb-4"
            />

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.14]">
              Every Success Story Begins with a Dream
            </h1>

            {/* Sub */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              From choosing the right European destination to achieving your study-abroad dreams, we are proud to be part of every milestone.
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('visa-success')}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-extrabold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer active:scale-95 border border-[#C9A84C]"
              >
                <span>Explore Success Stories</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.2 INTRO SECTION (Centred block, max-width 720px)
      ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[720px] mx-auto text-center space-y-4">
          <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
            OUR GALLERY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
            Our Journey, Your Success
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-2">
            <p>
              At Adam International, we believe every student's journey deserves to be celebrated. From taking the first step towards international education to receiving a visa approval, every milestone represents a dream moving closer to reality.
            </p>
            <p>
              Explore our gallery to discover student achievements, memorable events, university interactions and experiences that reflect our commitment to helping students pursue educational opportunities across Europe.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.3 CATEGORY TABS (Sticky tab bar under header)
          Only render if at least one category has items
      ========================================================================= */}
      {hasAnyItems && (
        <div className="sticky top-[64px] lg:top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3 px-4 sm:px-6">
          <div className="max-w-[1240px] mx-auto">
            <nav
              aria-label="Gallery category navigation"
              className="flex items-center gap-2 overflow-x-auto scrollbar-none"
            >
              {[
                { id: 'visa-success', label: 'All', target: 'visa-success' },
                { id: 'visa-success', label: 'Visa Success', target: 'visa-success' },
                { id: 'events', label: 'Events & Partnerships', target: 'events' },
                { id: 'student-life', label: 'Pre-Departure & Student Life', target: 'student-life' },
              ].map((tab, idx) => {
                const isActive = activeTab === tab.target && (idx > 0 || activeTab === 'visa-success');
                return (
                  <button
                    key={`${tab.id}-${idx}`}
                    type="button"
                    onClick={() => scrollToSection(tab.target)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                      isActive
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* =========================================================================
          3.4 SECTION: VISA SUCCESS (id="visa-success")
      ========================================================================= */}
      <section
        id="visa-success"
        className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-[1240px] mx-auto space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              STUDENT VISA SUCCESS STORIES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Dreams Approved, Futures Unlocked
            </h2>
            <h3 className="text-base sm:text-lg font-bold text-slate-700">
              Celebrating Student Success
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-1">
              Every achievement tells a story of ambition, dedication and new beginnings. Explore the journeys of students who have taken steps towards their international education goals with guidance from Adam International.
            </p>
          </div>

          {/* Grid or Empty State */}
          {visaItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-4">
                <Images className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <p className="text-base sm:text-lg text-slate-700 font-medium mb-6">
                We're adding photos from recent visa approvals. Read our students' stories in the meantime.
              </p>
              <Link
                to="/success-stories"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm transition-colors shadow-md"
              >
                <span>Read Student Stories</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </Link>
            </div>
          ) : (
            <>
              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {visaItems.slice(0, visaLimit).map((item, index) => {
                  const countryObj = item.country
                    ? countries.find(
                        (c) =>
                          c.slug === item.country ||
                          c.name.toLowerCase() === item.country.toLowerCase()
                      )
                    : null;
                  const formattedDate = formatGalleryDate(item.date);
                  const isVideo = Boolean(item.video?.id);

                  return (
                    <article
                      key={item.id || index}
                      onClick={() => openLightbox(visaItems, index)}
                      className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
                    >
                      {/* Media Container */}
                      <div className="relative w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.alt || item.caption || item.studentName || 'Student visa success'}
                          width={item.width || 800}
                          height={item.height || 1000}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Video Play Overlay */}
                        {isVideo && (
                          <div className="absolute inset-0 bg-[#0B1F3A]/25 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#0B1F3A]/85 text-white border-2 border-[#C9A84C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C] ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Top Badge: Type & Flag */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-[#0B1F3A]/80 backdrop-blur-md text-[#DFBE7A] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                              {item.type || 'Visa approval'}
                            </span>
                          </div>
                          {countryObj && (
                            <span className="text-xl drop-shadow-md leading-none" role="img" aria-label={countryObj.name}>
                              {countryObj.flag}
                            </span>
                          )}
                        </div>

                        {/* Caption overlay on desktop hover */}
                        {item.caption && (
                          <div className="hidden lg:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-white text-xs">
                            <p className="line-clamp-3 font-medium">{item.caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors truncate">
                            {item.studentName || 'Student'}
                          </h4>
                          {countryObj && (
                            <span className="text-xs font-semibold text-slate-500">
                              {countryObj.name}
                            </span>
                          )}
                        </div>

                        {item.university && (
                          <p className="text-xs text-slate-600 font-medium truncate flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>{item.university}</span>
                          </p>
                        )}

                        {item.message && (
                          <p className="text-xs italic text-slate-600 line-clamp-3 font-normal">
                            "{item.message}"
                          </p>
                        )}

                        {formattedDate && (
                          <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Show more button */}
              {visaItems.length > visaLimit && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setVisaLimit((prev) => prev + 9)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] font-bold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Show more</span>
                  </button>
                </div>
              )}

              {/* Link below grid */}
              <div className="text-center pt-6">
                <Link
                  to="/success-stories"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] underline transition-colors"
                >
                  <span>Read full student stories →</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          3.5 SECTION: EVENTS & PARTNERSHIPS (id="events")
      ========================================================================= */}
      <section
        id="events"
        className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-[1240px] mx-auto space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              UNIVERSITY PARTNERSHIPS & EVENTS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Connecting Students with Global Opportunities
            </h2>
            <h3 className="text-base sm:text-lg font-bold text-slate-700">
              Moments That Matter
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-1">
              From counselling sessions and university visits to educational events and pre-departure guidance, every moment reflects our commitment to supporting students throughout their study-abroad journey.
            </p>
          </div>

          {/* Filter chips (rendered only when at least one item exists) */}
          {eventItems.length > 0 && availableEventTypes.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {['All', ...availableEventTypes].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedEventType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedEventType === type
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Grid or Empty State */}
          {eventItems.length === 0 ? (
            <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-4">
                <Images className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <p className="text-base sm:text-lg text-slate-700 font-medium">
                Photos from our recent events and university visits are coming soon.
              </p>
            </div>
          ) : (
            <>
              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredEventItems.slice(0, eventsLimit).map((item, index) => {
                  const formattedDate = formatGalleryDate(item.date);
                  const isVideo = Boolean(item.video?.id);

                  return (
                    <article
                      key={item.id || index}
                      onClick={() => openLightbox(filteredEventItems, index)}
                      className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
                    >
                      {/* Media Container */}
                      <div className="relative w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.alt || item.caption || item.type || 'Event photo'}
                          width={item.width || 800}
                          height={item.height || 600}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {isVideo && (
                          <div className="absolute inset-0 bg-[#0B1F3A]/25 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#0B1F3A]/85 text-white border-2 border-[#C9A84C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C] ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Caption overlay on desktop hover */}
                        {item.caption && (
                          <div className="hidden lg:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-white text-xs">
                            <p className="line-clamp-3 font-medium">{item.caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        {item.type && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0B1F3A]/5 text-[#0B1F3A]">
                            {item.type}
                          </span>
                        )}

                        {item.caption && (
                          <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-3">
                            {item.caption}
                          </p>
                        )}

                        {(formattedDate || item.location) && (
                          <div className="text-xs text-slate-500 font-normal pt-1 flex items-center gap-1.5 truncate">
                            {formattedDate && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{formattedDate}</span>
                              </span>
                            )}
                            {formattedDate && item.location && <span>•</span>}
                            {item.location && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{item.location}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Show more button */}
              {filteredEventItems.length > eventsLimit && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setEventsLimit((prev) => prev + 9)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] font-bold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Show more</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          3.6 SECTION: PRE-DEPARTURE & STUDENT LIFE (id="student-life")
      ========================================================================= */}
      <section
        id="student-life"
        className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-[1240px] mx-auto space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              PRE-DEPARTURE & STUDENT LIFE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              From Kerala to Europe — A New Chapter Begins
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-1">
              Pre-departure sessions, travel preparation, student send-offs and moments shared by our students from Europe.
            </p>
          </div>

          {/* Grid or Empty State */}
          {studentLifeItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-4">
                <Images className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <p className="text-base sm:text-lg text-slate-700 font-medium">
                Photos from pre-departure sessions and student send-offs are coming soon.
              </p>
            </div>
          ) : (
            <>
              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {studentLifeItems.slice(0, studentLifeLimit).map((item, index) => {
                  const formattedDate = formatGalleryDate(item.date);
                  const isVideo = Boolean(item.video?.id);

                  return (
                    <article
                      key={item.id || index}
                      onClick={() => openLightbox(studentLifeItems, index)}
                      className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
                    >
                      {/* Media Container */}
                      <div className="relative w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.alt || item.caption || item.type || 'Student life photo'}
                          width={item.width || 800}
                          height={item.height || 600}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {isVideo && (
                          <div className="absolute inset-0 bg-[#0B1F3A]/25 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#0B1F3A]/85 text-white border-2 border-[#C9A84C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C] ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Caption overlay on desktop hover */}
                        {item.caption && (
                          <div className="hidden lg:flex flex-col justify-end absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-white text-xs">
                            <p className="line-clamp-3 font-medium">{item.caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        {item.type && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0B1F3A]/5 text-[#0B1F3A]">
                            {item.type}
                          </span>
                        )}

                        {item.caption && (
                          <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-3">
                            {item.caption}
                          </p>
                        )}

                        {(formattedDate || item.location) && (
                          <div className="text-xs text-slate-500 font-normal pt-1 flex items-center gap-1.5 truncate">
                            {formattedDate && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{formattedDate}</span>
                              </span>
                            )}
                            {formattedDate && item.location && <span>•</span>}
                            {item.location && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{item.location}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Show more button */}
              {studentLifeItems.length > studentLifeLimit && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStudentLifeLimit((prev) => prev + 9)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] font-bold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Show more</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          3.7 SECTION: CTA (Replaces FinalCtaBanner on this page)
      ========================================================================= */}
      <section className="w-full bg-[#0B1F3A] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center text-white border-t border-white/10">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 space-y-6 sm:space-y-8">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Journey Could Be Next
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
            Are you planning to study in Europe? Let Adam International help you explore suitable destinations, courses and universities and understand the student visa application process.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 w-full max-w-md sm:max-w-none mx-auto">
            <button
              type="button"
              onClick={() => openAppointment()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base transition-all duration-200 shadow-md cursor-pointer active:scale-98 group"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 hover:text-emerald-200 font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.items}
        currentIndex={lightboxState.index}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
