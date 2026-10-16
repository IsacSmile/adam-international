import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, X, ArrowRight } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import UniversityCard from '../components/shared/UniversityCard';
import SectionSkeleton from '../components/SectionSkeleton';
import { getVisibleUniversities } from '../lib/universities';
import { countries } from '../data/countries';
import { useAppointment } from '../context/AppointmentContext';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

const normalizeText = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function UniversitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openAppointment } = useAppointment();

  const selectedCountrySlug = searchParams.get('country') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  const visibleUniversities = useMemo(() => getVisibleUniversities(), []);

  // Only countries that have at least one visible university, sorted alphabetically
  const availableCountries = useMemo(() => {
    return countries
      .filter((country) =>
        visibleUniversities.some((u) => u.country === country.slug)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleUniversities]);

  // Reset pagination when filter or search changes
  React.useEffect(() => {
    setVisibleCount(24);
  }, [selectedCountrySlug, searchQuery]);

  // Filtered universities based on country chip and search input
  const filteredUniversities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const normQ = normalizeText(q);

    return visibleUniversities.filter((uni) => {
      // Country filter
      const matchesCountry =
        selectedCountrySlug === 'all' || uni.country === selectedCountrySlug;

      // Search query filter (university name or city, with accent-insensitive support)
      const matchesSearch =
        !q ||
        uni.name.toLowerCase().includes(q) ||
        normalizeText(uni.name).includes(normQ) ||
        (Boolean(uni.city) &&
          (uni.city.toLowerCase().includes(q) ||
            normalizeText(uni.city).includes(normQ)));

      return matchesCountry && matchesSearch;
    });
  }, [visibleUniversities, selectedCountrySlug, searchQuery]);

  const displayedUniversities = useMemo(() => {
    return filteredUniversities.slice(0, visibleCount);
  }, [filteredUniversities, visibleCount]);

  const handleCountrySelect = (slug) => {
    if (slug === 'all') {
      searchParams.delete('country');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ country: slug });
    }
  };

  return (
    <>
      <Helmet>
        <title>Universities we work with | Adam International</title>
        <meta
          name="description"
          content="Browse by country. Each profile has courses, fees, entry requirements and intakes."
        />
      </Helmet>

      {/* Navy Page Hero Band */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Universities' },
        ]}
        title="Universities we work with"
        subtitle="Browse by country. Each profile has courses, fees, entry requirements and intakes."
      />

      {/* Main Listing Section */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          {/* Controls: Country Filter Chips & Search Bar */}
          <div className="space-y-6 mb-10 sm:mb-14">
            {/* Search Input */}
            <div className="max-w-md relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by university name or city..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-[#0B1F3A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Country Filter Chips: All + countries with at least one university */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => handleCountrySelect('all')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedCountrySlug === 'all'
                    ? 'bg-[#0B1F3A] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>All</span>
              </button>

              {availableCountries.map((c) => {
                const isSelected = selectedCountrySlug === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleCountrySelect(c.slug)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1F3A] text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span role="img" aria-label={c.name} className="text-base leading-none">
                      {c.flag}
                    </span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Universities Grid or Empty State */}
          {filteredUniversities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {displayedUniversities.map((uni) => (
                  <UniversityCard key={uni.slug} university={uni} variant="light" />
                ))}
              </div>

              {visibleCount < filteredUniversities.length && (
                <div className="mt-10 sm:mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0B1F3A] font-bold text-sm shadow-sm transition-all hover:border-[#C9A84C] cursor-pointer"
                  >
                    <span>Load more</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Exact Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm">
              <p className="text-base sm:text-lg text-slate-700 font-medium mb-6 leading-relaxed">
                We're adding universities for this country. Ask an advisor for the current list.
              </p>
              <button
                type="button"
                onClick={() =>
                  openAppointment({
                    country: selectedCountrySlug !== 'all' ? selectedCountrySlug : undefined,
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm sm:text-base transition-colors shadow-md cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Final Conversion CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
