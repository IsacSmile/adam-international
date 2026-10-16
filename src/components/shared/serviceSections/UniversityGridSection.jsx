import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ExternalLink, ArrowRight, GraduationCap } from 'lucide-react';
import { getVisibleUniversities, sortUniversitiesFeaturedFirst } from '../../../lib/universities';
import { countries } from '../../../data/countries';

export default function UniversityGridSection({
  id,
  heading = 'Explore Universities We Support',
  sub,
  limit = 6,
  showDetails = true,
  buttonText = 'View All Universities',
  region,
  universities: customUniversities,
}) {
  let list = customUniversities || getVisibleUniversities();
  if (region) {
    list = list.filter((u) => {
      const c = countries.find((country) => country.slug === u.country);
      return c?.region === region;
    });
  }
  const displayUniversities = sortUniversitiesFeaturedFirst(list).slice(0, limit);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
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

          <Link
            to="/universities"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
          >
            <span>{buttonText}</span>
          </Link>
        </div>

        {/* University Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayUniversities.map((uni) => {
            const countryObj = countries.find((c) => c.slug === uni.country);
            const countryFlag = countryObj ? countryObj.flag : '🌍';
            const countryName = countryObj ? countryObj.name : uni.country?.replace('-', ' ');
            const locationDisplay = [uni.city, countryName].filter(Boolean).join(', ');

            // Extract unique programme subject areas (up to 3)
            const subjectAreas = Array.from(
              new Set((uni.programs || []).map((p) => p.name || p.title || p))
            ).slice(0, 3);

            return (
              <div
                key={uni.slug}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] hover:border-[#C9A84C] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Logo / Building Icon + Flag & Location */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#0B1F3A] shrink-0">
                      {uni.logo ? (
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-[#C9A84C]" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span className="text-sm leading-none">{countryFlag}</span>
                      <span>{locationDisplay}</span>
                    </div>
                  </div>

                  {/* University Name */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] leading-snug group-hover:text-[#C9A84C] transition-colors mb-3">
                    {uni.name}
                  </h3>

                  {showDetails && (
                    <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      {/* Subject Areas */}
                      {subjectAreas.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            Popular Subjects
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {subjectAreas.map((subj, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                              >
                                {subj}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Language of Instruction */}
                      {uni.languageOfInstruction && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                            Language of Instruction
                          </span>
                          <p className="text-slate-700 font-normal">
                            {uni.languageOfInstruction}
                          </p>
                        </div>
                      )}

                      {/* Admission Requirements */}
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                          Admission Requirements
                        </span>
                        {uni.requirements?.academic ? (
                          <p className="line-clamp-2 text-slate-700 font-normal">
                            {uni.requirements.academic}
                          </p>
                        ) : (
                          <Link
                            to={`/universities/${uni.slug}#requirements`}
                            className="text-[#0B1F3A] hover:text-[#C9A84C] font-semibold underline underline-offset-2 transition-colors inline-block"
                          >
                            View requirements
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Links */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  {uni.website ? (
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-[#0B1F3A] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Official website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span />
                  )}

                  <Link
                    to={`/universities/${uni.slug}`}
                    className="text-[#0B1F3A] group-hover:text-[#C9A84C] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View University Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Universities Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/universities"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold w-full"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
