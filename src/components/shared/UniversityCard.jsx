import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { countries } from '../../data/countries';

export default function UniversityCard({ university, variant = 'light' }) {
  if (!university) return null;

  const countryObj = countries.find((c) => c.slug === university.country);
  const countryFlag = countryObj ? countryObj.flag : '🌍';
  const countryName = countryObj ? countryObj.name : university.country;

  const isDark = variant === 'dark';

  return (
    <Link
      to={`/universities/${university.slug}`}
      className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 h-full select-none ${
        isDark
          ? 'bg-[#0F284B]/80 hover:bg-[#13335F] backdrop-blur-md border-white/10 hover:border-[#C9A84C]/80 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_30px_rgba(201,168,76,0.15)] text-white'
          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-[#C9A84C] shadow-sm hover:shadow-lg text-[#0B1F3A]'
      }`}
    >
      <div>
        {/* Top Icon & Country Flag */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm ${
              isDark
                ? 'bg-white/10 border border-white/15 text-[#DFBE7A] group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A]'
                : 'bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A]'
            }`}
          >
            <Building2 className="w-5 h-5" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isDark
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-sm leading-none">{countryFlag}</span>
            <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
              {countryName}
            </span>
          </div>
        </div>

        {/* University Name */}
        <h3
          className={`text-base sm:text-lg font-bold leading-snug mb-2 transition-colors ${
            isDark
              ? 'text-white group-hover:text-[#DFBE7A]'
              : 'text-[#0B1F3A] group-hover:text-[#C9A84C]'
          }`}
        >
          {university.name}
        </h3>

        {/* City / Location */}
        <div
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
          <span>{university.city ? `${university.city}, ${countryName}` : countryName}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={`pt-4 mt-4 border-t flex items-center justify-between text-xs font-bold transition-colors ${
          isDark
            ? 'border-white/10 text-[#DFBE7A] group-hover:text-white'
            : 'border-slate-100 text-[#0B1F3A] group-hover:text-[#C9A84C]'
        }`}
      >
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
