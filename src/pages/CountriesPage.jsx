import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, MessageSquare } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionSkeleton from '../components/SectionSkeleton';
import { countries } from '../data/countries';
import { universities } from '../data/universities';
import { useAppointment } from '../context/AppointmentContext';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

function CountryCard({ country, onTalkToAdvisor }) {
  const hasUniversities = universities.some((u) => u.country === country.slug);

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Country Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={country.image}
            alt={country.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 via-transparent to-transparent pointer-events-none" />

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
          <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 leading-snug">
            {country.name}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {country.blurb}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {hasUniversities ? (
          <>
            <Link
              to={`/universities?country=${country.slug}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              <span>See universities</span>
              <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
            </Link>

            <button
              type="button"
              onClick={() => onTalkToAdvisor(country.slug)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-[#0B1F3A] text-slate-700 hover:text-[#0B1F3A] text-xs sm:text-sm font-semibold transition-colors cursor-pointer bg-white"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Talk to an advisor</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onTalkToAdvisor(country.slug)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Talk to an advisor</span>
          </button>
        )}
      </div>
    </article>
  );
}

export default function CountriesPage() {
  const { openAppointment } = useAppointment();

  const europeCountries = countries.filter((c) => c.region === 'Europe');
  const otherCountries = countries.filter((c) => c.region === 'Other destinations');

  return (
    <>
      <Helmet>
        <title>Where you can study | Adam International</title>
        <meta
          name="description"
          content="These are the countries we currently help students apply to. Pick one to see the universities we work with there."
        />
      </Helmet>

      {/* Navy Page Hero */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Countries' },
        ]}
        title="Where you can study"
        subtitle="These are the countries we currently help students apply to. Pick one to see the universities we work with there."
      />

      <div className="bg-[#F8FAFC] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto space-y-14 sm:space-y-18">
          {/* Europe Section */}
          {europeCountries.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mb-6 sm:mb-8 tracking-tight">
                Europe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {europeCountries.map((country) => (
                  <CountryCard
                    key={country.slug}
                    country={country}
                    onTalkToAdvisor={(slug) => openAppointment({ country: slug })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Other Destinations Section */}
          {otherCountries.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mb-6 sm:mb-8 tracking-tight">
                Other destinations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {otherCountries.map((country) => (
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
      </div>

      {/* Final Conversion CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
