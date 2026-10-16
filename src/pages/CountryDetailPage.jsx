import React, { lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Building2,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  MapPin,
  Wallet,
  BookOpen,
  Languages,
  Briefcase,
  Calendar,
} from 'lucide-react';
import Breadcrumb from '../components/shared/Breadcrumb';
import UniversityCard from '../components/shared/UniversityCard';
import StoryStripSection from '../components/shared/serviceSections/StoryStripSection';
import LinkCardsSection from '../components/shared/serviceSections/LinkCardsSection';
import NotFoundPage from './NotFoundPage';
import { countries } from '../data/countries';
import { getVisibleUniversities } from '../lib/universities';
import { successStories } from '../data/successStories';
import { SHOW_PLACEHOLDERS } from '../lib/contentFlags';
import { useAppointment } from '../context/AppointmentContext';
import { getUpcomingEvents, getEventDateLabel, isRegistrationOpen } from '../lib/events';
import { useEvents } from '../hooks/useContent';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

export default function CountryDetailPage() {
  const { slug } = useParams();
  const { openAppointment } = useAppointment();
  const { data: eventsList } = useEvents();

  const country = countries.find((c) => c.slug === slug);

  // Unknown slug renders NotFoundPage
  if (!country) {
    return <NotFoundPage />;
  }

  // Filter visible universities for this country (no limit)
  const countryUniversities = getVisibleUniversities().filter((u) => u.country === country.slug);

  // Check for upcoming spot admission event for this country
  const upcomingEvent = getUpcomingEvents(eventsList).find((e) => e.country === country.slug);

  // Filter stories for this country (slug or name matching)
  const availableStories = SHOW_PLACEHOLDERS
    ? (successStories || [])
    : (successStories || []).filter((s) => !s.isPlaceholder);

  const countryStories = availableStories.filter(
    (s) =>
      s.country === country.slug ||
      s.country?.toLowerCase() === country.slug.toLowerCase() ||
      s.country?.toLowerCase() === country.name.toLowerCase()
  );

  // 4 other European countries for "Other destinations"
  const otherDestinations = countries
    .filter((c) => c.region === 'Europe' && c.slug !== country.slug)
    .slice(0, 4);

  // Smooth scroll to #universities with sticky header offset
  const handleScrollToUniversities = (e) => {
    e.preventDefault();
    const target = document.querySelector('#universities');
    if (!target) return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo('#universities', { offset: -80, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Study in ${country.name} | Adam International`}</title>
        <meta
          name="description"
          content={country.blurb || `Study abroad in ${country.name}. Partner universities, admission criteria, student visa guidance and support.`}
        />
      </Helmet>

      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0B1F3A] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Cover image backdrop */}
        {country.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/40 pointer-events-none" />
          </div>
        )}

        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb: Home / Countries / {name} */}
          <div className="mb-6 sm:mb-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Countries', href: '/countries' },
                { label: country.name },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Flag & Region Pill */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm mb-4">
                <span className="text-xl leading-none" role="img" aria-label={country.name}>
                  {country.flag}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {country.region || 'Study Destination'}
                </span>
                {country.universityCount && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-bold text-[#DFBE7A]">
                      {country.universityCount}
                    </span>
                  </>
                )}
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                Study in {country.name}
              </h1>

              {/* Blurb */}
              {country.blurb && (
                <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mb-8">
                  {country.blurb}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => openAppointment({ country: country.name })}
                  className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-[#0B1F3A]" />
                  <span>Talk to an Advisor</span>
                </button>

                {countryUniversities.length > 0 && (
                  <button
                    type="button"
                    onClick={handleScrollToUniversities}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <Building2 className="w-4 h-4 text-[#C9A84C]" />
                    <span>See Universities</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Card Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-sm group">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={country.image}
                    alt={`${country.name} destination view`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-bold text-sm sm:text-base">{country.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1.25 UPCOMING EVENT BANNER (only while event is upcoming) */}
      {upcomingEvent && (
        <aside
          aria-label="Upcoming Spot Admission Event"
          className="bg-amber-50/70 border-b border-[#C9A84C]/30 py-3.5 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#0B1F3A]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0B1F3A] text-[#DFBE7A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBE7A]" />
                Upcoming Event
              </span>
              <span className="font-bold text-[#0B1F3A]">{upcomingEvent.title}</span>
              {getEventDateLabel(upcomingEvent) && (
                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                  {getEventDateLabel(upcomingEvent)}
                </span>
              )}
              {upcomingEvent.highlight && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200/90 text-[#0B1F3A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  <span>{upcomingEvent.highlight}</span>
                  {upcomingEvent.conditionNote && (
                    <span className="font-normal text-slate-500 ml-0.5">
                      (*{upcomingEvent.conditionNote})
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              {!isRegistrationOpen(upcomingEvent) && (
                <button
                  type="button"
                  onClick={() => openAppointment({ country: country.name })}
                  className="text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Registration not open yet — talk to an advisor
                </button>
              )}
              <Link
                to={`/events/${upcomingEvent.slug}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors whitespace-nowrap group"
              >
                <span>{isRegistrationOpen(upcomingEvent) ? 'View Details & Register' : 'View Details'}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* 1.5 AT A GLANCE (Only if comparison data exists) */}
      {(() => {
        const comp = country.comparison;
        if (!comp) return null;

        const tuitionText = comp.tuition
          ? (comp.tuition.min && comp.tuition.max
              ? `€${comp.tuition.min}–${comp.tuition.max} ${comp.tuition.period || 'per year'} (${comp.tuition.academicYear || ''})`
              : comp.tuition.min
              ? `From €${comp.tuition.min} ${comp.tuition.period || 'per year'} (${comp.tuition.academicYear || ''})`
              : comp.tuition.note || null)
          : null;

        const livingText = comp.livingMonthly
          ? (comp.livingMonthly.min && comp.livingMonthly.max
              ? `€${comp.livingMonthly.min}–${comp.livingMonthly.max} per month`
              : comp.livingMonthly.min
              ? `From €${comp.livingMonthly.min} per month`
              : comp.livingMonthly.note || null)
          : null;

        const coursesText = Array.isArray(comp.popularFields) && comp.popularFields.length > 0
          ? `${comp.popularFields.join(', ')}${comp.englishTaught ? ' · English-taught programmes available' : ''}`
          : null;

        const languageText = comp.languageRequirements || null;

        const workText = comp.partTimeWork?.text || null;
        const workSourceUrl = comp.partTimeWork?.sourceUrl || null;

        const lastCheckedText = comp.lastChecked || null;

        const facts = [
          tuitionText && {
            icon: Wallet,
            title: 'Tuition fees',
            content: tuitionText,
          },
          livingText && {
            icon: Building2,
            title: 'Living expenses',
            content: livingText,
          },
          coursesText && {
            icon: BookOpen,
            title: 'Available courses',
            content: coursesText,
          },
          languageText && {
            icon: Languages,
            title: 'Language requirements',
            content: languageText,
          },
          workText && {
            icon: Briefcase,
            title: 'Part-time work',
            content: workText,
            link: workSourceUrl ? { url: workSourceUrl, label: 'Official source ↗' } : null,
          },
          lastCheckedText && {
            icon: Calendar,
            title: 'Last checked',
            content: lastCheckedText,
          },
        ].filter(Boolean);

        if (facts.length === 0) return null;

        return (
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-[1240px] mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight mb-8">
                At a Glance
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {facts.map((fact, idx) => {
                  const Icon = fact.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 text-[#C9A84C] flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          {fact.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                          {fact.content}
                        </p>
                      </div>

                      {fact.link && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <a
                            href={fact.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1"
                          >
                            <span>{fact.link.label}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 mt-6 font-normal">
                Fees and living costs vary by university, city and course. Figures are checked regularly. Last checked: {lastCheckedText || 'Recently'}. Always confirm current figures with the university or an advisor.
              </p>
            </div>
          </section>
        );
      })()}

      {/* 2. INTRO SECTION (only if country.intro exists) */}
      {country.intro && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto">
            <div className="max-w-3xl prose prose-slate text-base sm:text-lg text-slate-700 leading-relaxed space-y-4">
              {Array.isArray(country.intro) ? (
                country.intro.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <p>{country.intro}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. #universities SECTION */}
      <section id="universities" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-[1240px] mx-auto">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Universities in {country.name}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              Universities we currently help students apply to in {country.name}.
            </p>
          </div>

          {countryUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryUniversities.map((u) => (
                <UniversityCard key={u.slug} university={u} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <p className="text-base sm:text-lg text-slate-700 font-medium mb-6">
                We're adding universities in {country.name}. Ask an advisor for the current options.
              </p>
              <button
                type="button"
                onClick={() => openAppointment({ country: country.name })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm transition-colors shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A84C]" />
                <span>Talk to an Advisor</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. #visa SECTION */}
      <section id="visa" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[1240px] mx-auto">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Student Visa for {country.name}
            </h2>
          </div>

          {country.visa?.overview ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-3xl shadow-sm">
              <div className="prose prose-slate text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                {Array.isArray(country.visa.overview) ? (
                  country.visa.overview.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>{country.visa.overview}</p>
                )}
              </div>

              {country.visa.officialLinks?.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Official Government Sources
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {country.visa.officialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0B1F3A] hover:text-[#C9A84C] font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 max-w-xl">
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  Visa requirements change, so we confirm the current rules for {country.name} with you directly.
                </p>
              </div>
              <Link
                to="/services/visa-assistance#visa-form"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-xs sm:text-sm shrink-0 transition-colors shadow-sm"
              >
                <span>Get Visa Guidance</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. linkCards: How We Can Help */}
      <LinkCardsSection
        heading="How We Can Help"
        sub="Support from choosing a university to settling in."
        cards={[
          'admission-support',
          'visa-assistance',
          'financial-assistance',
          'pre-departure-post-landing',
        ]}
      />

      {/* 6. storyStrip: stories where country matches (hidden if none) */}
      {countryStories.length > 0 && (
        <StoryStripSection
          stories={countryStories}
          heading="Student Stories"
          button={{ label: 'View all stories →', to: `/success-stories?country=${country.slug}` }}
        />
      )}

      {/* 7. Other destinations: 4 compact cards for other European countries */}
      {otherDestinations.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                  Other Destinations in Europe
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
                  Explore other study destinations.
                </p>
              </div>
              <Link
                to="/countries"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors shrink-0"
              >
                <span>View all countries →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherDestinations.map((c) => (
                <Link
                  key={c.slug}
                  to={`/countries/${c.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={c.image}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-2xl drop-shadow-md leading-none" role="img" aria-label={c.name}>
                          {c.flag}
                        </span>
                        {c.universityCount && (
                          <span className="bg-[#0B1F3A]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                            {c.universityCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors mb-1.5 leading-snug">
                        {c.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {c.blurb}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                    <span>Explore {c.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global CTA Banner */}
      <Suspense fallback={null}>
        <FinalCtaBanner />
      </Suspense>
    </>
  );
}
