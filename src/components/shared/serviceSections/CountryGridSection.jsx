import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { countries as allCountries } from '../../../data/countries';

export default function CountryGridSection({
  id,
  heading,
  sub,
  countries = [],
  cardStyle = 'detailed',
  buttonLabel = 'Explore {name}',
  linkPrefix = '/countries/{slug}',
}) {
  const countryList = countries
    .map((slug) => allCountries.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {heading}
            </h2>
          )}
          {sub && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {sub}
            </p>
          )}
        </div>

        {/* Countries Grid */}
        <div className={`grid grid-cols-1 ${cardStyle === 'compact' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
          {countryList.map((country) => {
            const destinationUrl = linkPrefix
              .replace('{slug}', country.slug)
              .replace('{name}', encodeURIComponent(country.name));

            const btnText = buttonLabel.replace('{name}', country.name);

            if (cardStyle === 'compact') {
              return (
                <Link
                  key={country.slug}
                  to={destinationUrl}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_10px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_24px_rgba(11,31,58,0.08)] hover:border-[#C9A84C] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-3xl mb-3">{country.flag}</div>
                    <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-snug">
                      {country.name} Student Visa Assistance
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Guidance for students admitted to universities in {country.name}, from documents to appointment.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C]">
                    <span>{btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            }

            if (cardStyle === 'overview') {
              return (
                <Link
                  key={country.slug}
                  to={destinationUrl}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_10px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_24px_rgba(11,31,58,0.08)] hover:border-[#C9A84C] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{country.flag}</span>
                      <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                        Study in {country.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Universities · Courses · Admission
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C]">
                    <span>{btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            }

            // Default 'detailed' style
            return (
              <Link
                key={country.slug}
                to={destinationUrl}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_2px_12px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] hover:border-[#C9A84C] transition-all flex flex-col justify-between group"
              >
                <div>
                  {country.image && (
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                      <img
                        src={country.image}
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 text-xl px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-xs">
                        {country.flag}
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-snug">
                      {country.name}
                    </h3>

                    {country.blurb && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                        {country.blurb}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C]">
                    <span>{btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
