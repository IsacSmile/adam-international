import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Globe2,
  GraduationCap,
  FileCheck2,
  UserRound,
  ClipboardCheck,
  Plane,
  HeartHandshake,
  Star,
  ArrowRight,
  Phone,
  MessageSquare,
  MapPin,
  Navigation,
  ExternalLink,
  Calendar,
  Sparkles,
} from 'lucide-react';

import Breadcrumb from '../components/shared/Breadcrumb';
import { useAppointment } from '../context/AppointmentContext';
import { countries } from '../data/countries';
import { branches } from '../data/branches';
import { successStories } from '../data/successStories';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Haversine formula to calculate distance between two lat/lng coordinates in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AboutPage() {
  const { openAppointment } = useAppointment();

  // Why Choose Us cards ref for GSAP scroll trigger
  const whyChooseUsSectionRef = useRef(null);
  const cardsGridRef = useRef(null);

  // Selected branch for the interactive map
  const defaultBranch = branches.find((b) => b.isHeadOffice) || branches[0];
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [locationStatus, setLocationStatus] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const branchCardRefs = useRef({});

  // 1. GSAP animation with cleanup and prefers-reduced-motion check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (cardsGridRef.current) {
        gsap.fromTo(
          cardsGridRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, whyChooseUsSectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Geolocation nearest branch detector
  const handleFindNearestBranch = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        type: 'error',
        message:
          "We couldn't get your location. Pick the office closest to you below.",
      });
      return;
    }

    setIsLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;

        let closestBranch = branches[0];
        let minDistance = Infinity;

        branches.forEach((branch) => {
          if (branch.lat && branch.lng) {
            const dist = calculateDistanceKm(
              latitude,
              longitude,
              branch.lat,
              branch.lng
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestBranch = branch;
            }
          }
        });

        setSelectedBranch(closestBranch);
        setLocationStatus({
          type: 'success',
          message: `Your nearest office is ${closestBranch.name}.`,
        });

        // Scroll the selected branch card into view gently
        const cardEl = branchCardRefs.current[closestBranch.slug];
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      },
      () => {
        setIsLocating(false);
        setLocationStatus({
          type: 'error',
          message:
            "We couldn't get your location. Pick the office closest to you below.",
        });
      },
      { timeout: 10000 }
    );
  };

  // 3. European destinations data (Exact 8 countries in exact specified order)
  const europeanSlugs = [
    'hungary',
    'slovenia',
    'slovakia',
    'latvia',
    'lithuania',
    'malta',
    'bulgaria',
    'germany',
  ];

  const exploreCountries = europeanSlugs
    .map((slug) => countries.find((c) => c.slug === slug))
    .filter(Boolean);

  // 4. Testimonials (Exact 3 stories from successStories.js, preferring consentOnFile)
  const storiesWithConsent = successStories.filter((s) => s.consentOnFile);
  const displayStories =
    storiesWithConsent.length >= 3
      ? storiesWithConsent.slice(0, 3)
      : successStories.slice(0, 3);

  return (
    <div className="w-full bg-white text-[#0B1F3A] overflow-x-hidden">
      <Helmet>
        <title>About Us | Adam International</title>
        <meta
          name="description"
          content="Adam International helps students choose the right course and university in Europe and beyond, with support from admission and visa to pre-departure."
        />
      </Helmet>

      {/* =========================================================================
          SECTION 1: HERO (FULL-WIDTH WITH EUROPEAN CAMPUS IMAGE)
      ========================================================================= */}
      <section className="relative w-full min-h-[540px] lg:min-h-[620px] flex items-center bg-[#0B1F3A] overflow-hidden pt-28 pb-16 lg:py-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/hero.jpg"
            alt="University of Debrecen main building in Hungary"
            className="w-full h-full object-cover object-center"
          />
          {/* Navy Gradient Overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/40 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Breadcrumb: Home / About Us */}
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
              className="mb-4"
            />

            {/* Main H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.14]">
              Your Journey to European Education Starts Here
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              From choosing the right course and university to admission, visa
              assistance and pre-departure support, Adam International helps
              students turn their study-abroad ambitions into reality.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={() => openAppointment()}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-white text-[#0B1F3A] font-extrabold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer active:scale-95 border border-[#C9A84C]"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
              </button>

              <Link
                to="/countries"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
              >
                <span>Explore Our Destinations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHO WE ARE (TWO-COLUMN DESKTOP SPLIT / STACKED MOBILE)
      ========================================================================= */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Text & 2x2 Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block mb-2">
                WHO WE ARE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
                Who We Are
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Adam International is an overseas education consultancy dedicated
              to helping students discover the right academic opportunities in
              Europe and other international destinations. We provide
              personalized guidance based on each student's academic background,
              career goals, preferred destination and budget.
            </p>

            {/* 4 Highlights (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0 shadow-sm">
                  <Compass className="w-5 h-5 text-[#DFBE7A]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                  Study Abroad Guidance
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0 shadow-sm">
                  <Globe2 className="w-5 h-5 text-[#DFBE7A]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                  European Destinations
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0 shadow-sm">
                  <GraduationCap className="w-5 h-5 text-[#DFBE7A]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                  University & Course Selection
                </span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0 shadow-sm">
                  <FileCheck2 className="w-5 h-5 text-[#DFBE7A]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                  Visa & Admission Assistance
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <img
                src="/images/about/who-we-are.jpg"
                alt="Students studying in a university library"
                className="w-full h-auto max-h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHY STUDENTS CHOOSE ADAM INTERNATIONAL (6 CARDS + GSAP)
      ========================================================================= */}
      <section
        ref={whyChooseUsSectionRef}
        className="w-full py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/60"
      >
        <div className="max-w-[1280px] mx-auto space-y-10 sm:space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              WHY CHOOSE US
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Why Students Choose Adam International
            </h2>
          </div>

          {/* 6 Cards Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
          <div
            ref={cardsGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <UserRound className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Personalized Counselling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guidance based on your academic profile, career goals and preferred
                destination.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                University & Course Guidance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Explore suitable universities and courses based on your interests
                and eligibility.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Complete Application Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Support with applications, documentation and admission
                procedures.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Visa Assistance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guidance throughout the student visa application process.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Pre-Departure Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Preparation for travel, accommodation and your transition to
                studying abroad.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#B3913B]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Continued Student Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Support even after you begin your international education
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: EXPLORE EUROPE WITH ADAM INTERNATIONAL (8 COUNTRY CARDS)
      ========================================================================= */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto space-y-10 sm:space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              EUROPEAN DESTINATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Explore Europe With Adam International
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Pick a country to see the universities we work with there, or talk
              to an advisor about your options.
            </p>
          </div>

          {/* 8 Cards Grid: 4 cols desktop, 2 cols tablet, 2 cols mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {exploreCountries.map((c) => (
              <Link
                key={c.slug}
                to={`/countries/${c.slug}`}
                className="block h-full group"
              >
                <div className="h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
                  {/* Country Image with gentle zoom */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                    <img
                      src={c.image}
                      alt={`${c.name} study abroad destination`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Country Name & Flag Overlaid */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white font-bold text-sm sm:text-base drop-shadow-sm">
                      <span className="text-xl sm:text-2xl">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-3.5 sm:p-4 mt-auto bg-white border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                    <span>Explore {c.name} →</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Text link below the grid */}
          <div className="text-center pt-2">
            <Link
              to="/countries"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors group"
            >
              <span>See all destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHAT OUR STUDENTS SAY (EXACTLY 3 STORIES FROM DATA)
      ========================================================================= */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-[1280px] mx-auto space-y-10 sm:space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
              STUDENT STORIES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              What Our Students Say
            </h2>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {displayStories.map((story) => {
              const countryObj = countries.find((c) => c.slug === story.country);
              const initials = story.studentName
                ? story.studentName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                : 'ST';

              return (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Stars (Only if rating exists) */}
                    {story.rating ? (
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current text-amber-400"
                          />
                        ))}
                      </div>
                    ) : null}

                    {/* Student Quote */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{story.quote}"
                    </p>
                  </div>

                  {/* Student Details & Link */}
                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      {story.photo ? (
                        <img
                          src={story.photo}
                          alt={story.studentName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-xs">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-[#0B1F3A] truncate">
                          {story.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          {countryObj?.flag && <span>{countryObj.flag}</span>}
                          <span>{story.university}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Link
                        to={`/success-stories#${story.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] hover:text-[#0B1F3A] transition-colors group"
                      >
                        <span>Read their story</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Under Section Link */}
          <div className="text-center pt-2">
            <Link
              to="/success-stories"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors group"
            >
              <span>View All Success Stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: VISIT US (INTERACTIVE 6 BRANCHES + EMBEDDED MAP)
      ========================================================================= */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto space-y-10 sm:space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] sm:text-xs font-extrabold text-[#C9A84C] tracking-widest uppercase block">
                OUR BRANCHES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
                Visit Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Meet an advisor in person at any of our six offices across Kerala
                and Karnataka.
              </p>
            </div>

            {/* Geolocation Button */}
            <div>
              <button
                type="button"
                onClick={handleFindNearestBranch}
                disabled={isLocating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#C9A84C] text-white hover:text-[#0B1F3A] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Navigation
                  className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`}
                />
                <span>
                  {isLocating
                    ? 'Locating nearest office...'
                    : 'Find Your Nearest Office →'}
                </span>
              </button>
            </div>
          </div>

          {/* Location Feedback Toast Banner */}
          {locationStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
                locationStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{locationStatus.message}</span>
            </div>
          )}

          {/* Layout: Branch Cards on Left, Map on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Branch Cards: 2x3 Grid on Desktop, Stacked on Mobile */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.map((b) => {
                const isSelected = selectedBranch.slug === b.slug;
                const phoneToCall = b.phone || '+91 9895 890 500';

                return (
                  <div
                    key={b.slug}
                    ref={(el) => (branchCardRefs.current[b.slug] = el)}
                    onClick={() => setSelectedBranch(b)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-slate-50 border-[#C9A84C] ring-2 ring-[#C9A84C]/30 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-[#0B1F3A]">
                          {b.name}
                        </h3>
                        {b.isHeadOffice && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C9A84C]/20 text-[#B3913B] border border-[#C9A84C]/30 shrink-0">
                            Head Office
                          </span>
                        )}
                      </div>

                      {/* Address or coming soon */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {b.address || 'Full address coming soon.'}
                      </p>

                      {/* Phone link */}
                      <div className="pt-1">
                        <a
                          href={`tel:${phoneToCall.replace(/\s+/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-[#0B1F3A] hover:text-[#C9A84C] font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                          <span>{phoneToCall}</span>
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAppointment({ branch: b.name });
                        }}
                        className="text-[#0B1F3A] hover:text-[#C9A84C] transition-colors cursor-pointer"
                      >
                        Book a visit →
                      </button>

                      {b.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            b.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#C9A84C] hover:text-[#0B1F3A] transition-colors"
                        >
                          <span>Get directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map on Right: Lazy-loaded iframe or fallback panel */}
            <div className="lg:col-span-5 h-[360px] sm:h-[420px] lg:h-[480px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md sticky top-28 bg-slate-100">
              {selectedBranch.address ? (
                <iframe
                  title={`Map of ${selectedBranch.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    selectedBranch.address
                  )}&output=embed`}
                  loading="lazy"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-[#0B1F3A] text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#DFBE7A]">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="font-bold text-lg text-white">
                      {selectedBranch.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Full address coming soon. Call +91 9895 890 500 for
                      directions.
                    </p>
                  </div>
                  <a
                    href="tel:+919895890500"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] text-[#0B1F3A] font-bold text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call +91 9895 890 500</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CTA (FULL-WIDTH NAVY BAND WITH GOLD ACCENT)
      ========================================================================= */}
      <section className="w-full bg-[#0B1F3A] py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 relative overflow-hidden text-center text-white">
        {/* Background Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          {/* Gold Accent Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFBE7A] text-[11px] sm:text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>START YOUR GLOBAL JOURNEY</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18]">
            Ready to Start Your Study Abroad Journey?
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
            Let's find the right country, course and university for you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={() => openAppointment()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#C9A84C] hover:bg-white text-[#0B1F3A] font-extrabold text-base transition-all duration-300 shadow-xl cursor-pointer active:scale-95 border border-[#C9A84C]"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-5 h-5 text-[#0B1F3A]" />
            </button>

            <a
              href="https://wa.me/919895890500"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-white font-extrabold text-base transition-all duration-300 shadow-md active:scale-95 backdrop-blur-md"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Talk to an Expert</span>
            </a>
          </div>

          {/* Direct Call Link Line */}
          <div className="pt-2 text-xs sm:text-sm text-slate-400 font-medium">
            <span>Or call us on </span>
            <a
              href="tel:+919895890500"
              className="text-white hover:text-[#C9A84C] font-bold underline underline-offset-4 transition-colors"
            >
              +91 9895 890 500
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
