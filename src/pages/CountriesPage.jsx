import React, { lazy, Suspense, useState, useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Search, X, SlidersHorizontal, Check } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionSkeleton from '../components/SectionSkeleton';
import CardGridSection from '../components/shared/serviceSections/CardGridSection';
import UniversityGridSection from '../components/shared/serviceSections/UniversityGridSection';
import StoryStripSection from '../components/shared/serviceSections/StoryStripSection';
import { countries } from '../data/countries';
import { universities } from '../data/universities';
import { budgetBands, courseCategories, studyLevels } from '../data/countryFilters';
import { useAppointment } from '../context/AppointmentContext';
import { useLenis } from '../components/SmoothScroll';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

const chooseCountryItems = [
  {
    icon: 'Wallet',
    title: 'Consider Your Budget',
    text: 'Compare tuition fees, accommodation, transport, insurance and other living expenses.',
  },
  {
    icon: 'BookOpen',
    title: 'Choose Your Course',
    text: 'Check course availability, entry requirements, language of instruction and university recognition.',
  },
  {
    icon: 'FileCheck2',
    title: 'Understand Visa Requirements',
    text: 'Review the student visa process, financial requirements and documentation for your destination.',
  },
  {
    icon: 'Users',
    title: 'Explore Student Life',
    text: 'Research accommodation, transport, local culture and the support available to international students.',
  },
];

function hasComparisonData(country) {
  if (!country || !country.comparison) return false;
  const c = country.comparison;
  if (c.tuition && (c.tuition.min || c.tuition.max || c.tuition.note)) return true;
  if (c.livingMonthly && (c.livingMonthly.min || c.livingMonthly.max || c.livingMonthly.note)) return true;
  if (Array.isArray(c.popularFields) && c.popularFields.length > 0) return true;
  if (c.englishTaught !== null && c.englishTaught !== undefined) return true;
  if (c.languageRequirements) return true;
  if (c.partTimeWork && (c.partTimeWork.text || c.partTimeWork.sourceUrl)) return true;
  if (c.budgetBand) return true;
  if (Array.isArray(c.courseCategories) && c.courseCategories.length > 0) return true;
  if (Array.isArray(c.studyLevels) && c.studyLevels.length > 0) return true;
  return false;
}

const COMPARISON_FACTORS = [
  {
    key: 'tuition',
    label: 'Tuition fees',
    render: (c) => {
      const t = c.comparison?.tuition;
      if (!t) return null;
      if (t.min && t.max) {
        return `€${t.min}–${t.max} ${t.period || 'per year'}${t.academicYear ? ` (${t.academicYear})` : ''}`;
      }
      if (t.min) {
        return `From €${t.min} ${t.period || 'per year'}${t.academicYear ? ` (${t.academicYear})` : ''}`;
      }
      return t.note || null;
    },
  },
  {
    key: 'living',
    label: 'Living expenses',
    render: (c) => {
      const l = c.comparison?.livingMonthly;
      if (!l) return null;
      if (l.min && l.max) {
        return `€${l.min}–${l.max} per month`;
      }
      if (l.min) {
        return `From €${l.min} per month`;
      }
      return l.note || null;
    },
  },
  {
    key: 'courses',
    label: 'Available courses',
    render: (c) => {
      const comp = c.comparison;
      if (!comp) return null;
      const parts = [];
      if (Array.isArray(comp.popularFields) && comp.popularFields.length > 0) {
        parts.push(comp.popularFields.join(', '));
      }
      if (comp.englishTaught === true) {
        parts.push('English-taught programmes available');
      }
      if (parts.length === 0) return null;
      return parts.join(' · ');
    },
  },
  {
    key: 'language',
    label: 'Language requirements',
    render: (c) => c.comparison?.languageRequirements || null,
  },
  {
    key: 'work',
    label: 'Part-time work',
    render: (c) => {
      const w = c.comparison?.partTimeWork;
      if (!w || !w.text) return null;
      return (
        <div>
          <span>{w.text}</span>
          {w.sourceUrl && (
            <a
              href={w.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0B1F3A] hover:text-[#C9A84C] font-bold block mt-1 underline"
            >
              Official source ↗
            </a>
          )}
        </div>
      );
    },
  },
  {
    key: 'visa',
    label: 'Visa requirements',
    render: (c) => {
      const link = c.visa?.officialLinks?.[0];
      if (!link || !link.url) return null;
      return (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#0B1F3A] hover:text-[#C9A84C] underline transition-colors"
        >
          Official visa information ↗
        </a>
      );
    },
  },
  {
    key: 'universities',
    label: 'Universities',
    render: (c) => {
      const unis = universities.filter((u) => u.country === c.slug);
      if (unis.length === 0) return null;
      const displayUnis = unis.slice(0, 3);
      const remaining = unis.length - 3;
      return (
        <div className="space-y-1">
          {displayUnis.map((u) => (
            <Link
              key={u.slug}
              to={`/universities/${u.slug}`}
              className="block text-xs font-semibold text-[#0B1F3A] hover:text-[#C9A84C] hover:underline truncate"
            >
              {u.name}
            </Link>
          ))}
          {remaining > 0 && (
            <Link
              to="/universities"
              className="text-[11px] font-bold text-[#C9A84C] hover:underline block"
            >
              +{remaining} more
            </Link>
          )}
        </div>
      );
    },
  },
];

function CompareCountriesSection({ eligibleCountries }) {
  const [selectedSlugs, setSelectedSlugs] = useState(() =>
    eligibleCountries.slice(0, 4).map((c) => c.slug)
  );

  const toggleCountry = (slug) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  };

  const comparedCountries = selectedSlugs
    .map((s) => eligibleCountries.find((c) => c.slug === s))
    .filter(Boolean);

  const latestChecked =
    comparedCountries
      .map((c) => c.comparison?.lastChecked)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            Compare Study Destinations
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A quick comparison to help you shortlist. Check each country page for full details.
          </p>
        </div>

        {/* Country Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
              Choose countries to compare (up to 4):
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {selectedSlugs.length}/4 selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {eligibleCountries.map((c) => {
              const isSelected = selectedSlugs.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCountry(c.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A84C]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Comparison Table (sticky first column, horizontal scroll inside container only) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="sticky left-0 bg-slate-50 p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 w-48 min-w-[192px] z-10 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  Factor
                </th>
                {comparedCountries.map((country) => (
                  <th key={country.slug} className="p-4 min-w-[220px] text-sm font-bold text-[#0B1F3A]">
                    <Link
                      to={`/countries/${country.slug}`}
                      className="inline-flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_FACTORS.map((factor) => (
                <tr key={factor.key} className="hover:bg-slate-50/40 transition-colors">
                  <td className="sticky left-0 bg-white p-4 text-xs font-bold text-[#0B1F3A] z-10 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    {factor.label}
                  </td>
                  {comparedCountries.map((country) => {
                    const val = factor.render(country);
                    return (
                      <td key={country.slug} className="p-4 text-xs font-medium text-slate-700 leading-relaxed align-top">
                        {val || <span className="text-slate-400 italic font-normal">Ask an advisor</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Country Cards */}
        <div className="md:hidden space-y-6">
          {comparedCountries.map((country) => (
            <div
              key={country.slug}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <Link
                  to={`/countries/${country.slug}`}
                  className="inline-flex items-center gap-2 text-base font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span>{country.name}</span>
                </Link>
                <Link
                  to={`/countries/${country.slug}`}
                  className="text-xs font-bold text-[#C9A84C]"
                >
                  Details →
                </Link>
              </div>

              <div className="space-y-3 divide-y divide-slate-100">
                {COMPARISON_FACTORS.map((factor) => {
                  const val = factor.render(country);
                  return (
                    <div key={factor.key} className="pt-2.5 first:pt-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {factor.label}
                      </span>
                      <div className="text-xs font-semibold text-slate-700">
                        {val || <span className="text-slate-400 italic font-normal">Ask an advisor</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Note below comparison */}
        <p className="text-xs text-slate-500 mt-6 font-normal">
          Fees and living costs vary by university, city and course. Figures are checked regularly. Last checked: {latestChecked || 'Recently'}. Always confirm current figures with the university or an advisor.
        </p>
      </div>
    </section>
  );
}

function CountryCard({ country, onTalkToAdvisor }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full">
      <div>
        {/* Country Image with 4:3 ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={country.image}
            alt={country.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent pointer-events-none" />

          {/* Featured Badge (only if featured: true) */}
          {country.featured && (
            <div className="absolute top-3 left-3 bg-[#C9A84C] text-[#0B1F3A] text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              Featured
            </div>
          )}

          {/* Flag and University Count Pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="text-2xl drop-shadow-md leading-none" role="img" aria-label={country.name}>
              {country.flag}
            </span>

            {country.universityCount && (
              <span className="bg-[#0B1F3A]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                {country.universityCount}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-xl font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors mb-2 leading-snug">
            {country.name}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
            {country.blurb}
          </p>
        </div>
      </div>

      {/* Card Actions (pinned to bottom) */}
      <div className="p-5 sm:p-6 mt-auto border-t border-slate-100 pt-4 flex flex-col items-center gap-2.5">
        <Link
          to={`/countries/${country.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.99] group/btn"
        >
          <span>Explore {country.name}</span>
          <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={() => onTalkToAdvisor(country.slug)}
          className="text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] transition-colors cursor-pointer py-1"
        >
          or talk to an advisor
        </button>
      </div>
    </article>
  );
}

export default function CountriesPage() {
  const { openAppointment } = useAppointment();
  const lenis = useLenis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // URL Query Parameters
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'featured';
  const budget = searchParams.get('budget') || '';
  const course = searchParams.get('course') || '';
  const lang = searchParams.get('lang') || '';
  const level = searchParams.get('level') || '';

  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'featured') {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
    setIsMobileFiltersOpen(false);
  };

  const handleScrollToCountries = () => {
    const el = document.getElementById('countries');
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -40, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Comparison eligible countries (at least 2 required to render comparison section)
  const eligibleCountries = countries.filter(hasComparisonData);

  // Check data availability across all countries for data-driven filters
  const hasBudgetData = countries.some((c) => Boolean(c.comparison?.budgetBand));
  const hasCourseData = countries.some((c) => Array.isArray(c.comparison?.courseCategories) && c.comparison.courseCategories.length > 0);
  const hasLangData = countries.some(
    (c) => c.comparison?.englishTaught === true || c.comparison?.englishTaught === false
  );
  const hasLevelData = countries.some((c) => Array.isArray(c.comparison?.studyLevels) && c.comparison.studyLevels.length > 0);
  const hasAnyDataFilters = hasBudgetData || hasCourseData || hasLangData || hasLevelData;

  const isFiltered = Boolean(q || (sort && sort !== 'featured') || budget || course || lang || level);
  const activeFilterCount = [budget, course, lang, level].filter(Boolean).length;

  // Filter countries
  const filteredCountries = countries.filter((country) => {
    if (q) {
      const query = q.toLowerCase().trim();
      const matchName = country.name.toLowerCase().includes(query);
      const matchBlurb = country.blurb?.toLowerCase().includes(query);
      if (!matchName && !matchBlurb) return false;
    }

    if (budget && country.comparison?.budgetBand !== budget) {
      return false;
    }

    if (course && !country.comparison?.courseCategories?.includes(course)) {
      return false;
    }

    if (lang === 'english' && country.comparison?.englishTaught !== true) {
      return false;
    }
    if (lang === 'other' && country.comparison?.englishTaught !== false) {
      return false;
    }

    if (level && !country.comparison?.studyLevels?.includes(level)) {
      return false;
    }

    return true;
  });

  // Sort countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sort === 'az') {
      return a.name.localeCompare(b.name);
    }
    // Default: 'featured' order (featured: true first, then file order)
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Groups
  const europeList = sortedCountries.filter((c) => c.region === 'Europe');
  const otherList = sortedCountries.filter((c) => c.region !== 'Europe');

  return (
    <>
      <Helmet>
        <title>Study Destinations in Europe | Adam International</title>
        <meta
          name="description"
          content="Explore European study destinations, compare countries and find universities that match your goals, budget and course."
        />
      </Helmet>

      {/* 2.1 Hero */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Countries' },
        ]}
        title="Discover the Best European Countries to Study Abroad"
        subtitle="Explore European study destinations and find the country that matches your academic goals, budget, preferred course and future plans. Compare universities, tuition fees, living expenses and available study opportunities before making your decision."
        actions={
          <>
            <button
              type="button"
              onClick={handleScrollToCountries}
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>Explore Countries</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>

            <Link
              to="/universities"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-200"
            >
              <span>Find Universities</span>
            </Link>

            <button
              type="button"
              onClick={() => openAppointment()}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <span>Get Guidance</span>
            </button>
          </>
        }
      />

      {/* 2.2 Section: How to Choose the Right Country */}
      <CardGridSection
        eyebrow="CHOOSING A DESTINATION"
        heading="How to Choose the Right Country"
        columns={4}
        items={chooseCountryItems}
      />

      {/* 2.3 Section: Compare Countries (only rendered if at least 2 countries have comparison data) */}
      {eligibleCountries.length >= 2 && (
        <CompareCountriesSection eligibleCountries={eligibleCountries} />
      )}

      {/* 2.4 Section: All destinations */}
      <section id="countries" className="bg-[#F8FAFC] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-[1240px] mx-auto space-y-8 sm:space-y-10">
          
          {/* Header & Controls Bar */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight mb-6">
              Explore Countries
            </h2>

            {/* Filter / Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateParam('q', e.target.value)}
                    placeholder="Search by country name..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all"
                  />
                  {q && (
                    <button
                      type="button"
                      onClick={() => updateParam('q', '')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
                    Sort:
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                    aria-label="Sort destinations"
                    className="w-full md:w-auto py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="az">A–Z</option>
                  </select>
                </div>

                {/* Mobile Filters Toggle Button (rendered only if data-driven filters exist) */}
                {hasAnyDataFilters && (
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="md:hidden inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-[#0B1F3A] hover:bg-slate-100 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#C9A84C]" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#0B1F3A] text-white text-[11px] font-bold flex items-center justify-center ml-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Desktop Data-Driven Filters Row (rendered only if at least one country has data) */}
              {hasAnyDataFilters && (
                <div className="hidden md:flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                  {hasBudgetData && (
                    <div className="space-y-1">
                      <select
                        value={budget}
                        onChange={(e) => updateParam('budget', e.target.value)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                      >
                        <option value="">All Budgets</option>
                        {budgetBands.map((b) => (
                          <option key={b.key} value={b.key}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-400 block">
                        approx. total cost/yr (tuition + living)
                      </span>
                    </div>
                  )}

                  {hasCourseData && (
                    <select
                      value={course}
                      onChange={(e) => updateParam('course', e.target.value)}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                    >
                      <option value="">All Courses</option>
                      {courseCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}

                  {hasLangData && (
                    <select
                      value={lang}
                      onChange={(e) => updateParam('lang', e.target.value)}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                    >
                      <option value="">All Languages</option>
                      <option value="english">English-taught programmes</option>
                      <option value="other">Other languages</option>
                    </select>
                  )}

                  {hasLevelData && (
                    <select
                      value={level}
                      onChange={(e) => updateParam('level', e.target.value)}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                    >
                      <option value="">All Study Levels</option>
                      {studyLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Results Count & Clear Link */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mt-4 px-1">
              <span>
                Showing <strong className="text-[#0B1F3A] font-bold">{sortedCountries.length}</strong> of{' '}
                <strong className="text-[#0B1F3A] font-bold">{countries.length}</strong> destinations
              </span>

              {isFiltered && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="font-semibold text-[#0B1F3A] hover:text-[#C9A84C] underline transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {sortedCountries.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
              <p className="text-slate-700 font-semibold mb-4 text-base">
                No destinations match these filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-sm font-bold hover:bg-[#13335F] transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : isFiltered ? (
            /* Flat list when search or filters are active */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {sortedCountries.map((country) => (
                <CountryCard
                  key={country.slug}
                  country={country}
                  onTalkToAdvisor={(slug) => openAppointment({ country: slug })}
                />
              ))}
            </div>
          ) : (
            /* Grouped lists when not filtered */
            <div className="space-y-12 sm:space-y-16">
              {/* Europe Section */}
              {europeList.length > 0 && (
                <section>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] mb-6 sm:mb-8 tracking-tight">
                    Europe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {europeList.map((country) => (
                      <CountryCard
                        key={country.slug}
                        country={country}
                        onTalkToAdvisor={(slug) => openAppointment({ country: slug })}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Other Study Destinations Section */}
              {otherList.length > 0 && (
                <section>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] mb-6 sm:mb-8 tracking-tight">
                    Other Study Destinations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {otherList.map((country) => (
                      <CountryCard
                        key={country.slug}
                        country={country}
                        onTalkToAdvisor={(slug) => openAppointment({ country: slug })}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

        </div>
      </section>

      {/* 2.5 Section: Explore Universities Across Europe */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <UniversityGridSection
          heading="Explore Universities Across Europe"
          sub="Universities we currently help students apply to."
          region="Europe"
          limit={6}
          showDetails={true}
        />
      </Suspense>

      {/* 2.6 Section: Real Students. Real Journeys. */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <StoryStripSection
          heading="Real Students. Real Journeys."
          sub="Experiences from students who studied abroad with our support."
          button={{ label: 'Read Student Stories', to: '/success-stories' }}
        />
      </Suspense>

      {/* Mobile Filters Bottom Sheet (Drawer) */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-6 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Filter Destinations</h3>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {hasBudgetData && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Study budget (approx. per year)
                  </label>
                  <span className="text-[11px] text-slate-500 block mb-2">
                    approximate total cost per year (tuition + living)
                  </span>
                  <select
                    value={budget}
                    onChange={(e) => updateParam('budget', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  >
                    <option value="">All Budgets</option>
                    {budgetBands.map((b) => (
                      <option key={b.key} value={b.key}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {hasCourseData && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Course category
                  </label>
                  <select
                    value={course}
                    onChange={(e) => updateParam('course', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  >
                    <option value="">All Courses</option>
                    {courseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {hasLangData && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => updateParam('lang', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  >
                    <option value="">All Languages</option>
                    <option value="english">English-taught programmes</option>
                    <option value="other">Other languages</option>
                  </select>
                </div>
              )}

              {hasLevelData && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Study level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => updateParam('level', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  >
                    <option value="">All Study Levels</option>
                    {studyLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#13335F] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.7 Final Conversion CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
