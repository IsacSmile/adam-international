import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Award, GraduationCap, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { countries } from '../../data/countries';

export default function VisaApprovalCard({ approval }) {
  if (!approval) return null;

  const countryObj = countries.find(
    (c) => c.slug === approval.country || c.name.toLowerCase() === approval.country.toLowerCase()
  );
  const countryName = countryObj ? countryObj.name : approval.country;
  const countryFlag = countryObj ? countryObj.flag : '🌍';

  // Initials fallback
  const initials = approval.studentName
    ? approval.studentName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AI';

  const formattedDate = approval.approvalDate ? formatDate(approval.approvalDate) : null;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-[0_10px_35px_rgba(11,31,58,0.06)] hover:shadow-[0_22px_50px_rgba(11,31,58,0.15)] hover:border-[#C9A84C] transition-all duration-500 overflow-hidden flex flex-col justify-between group transform hover:-translate-y-2 relative">
      {/* Top Decorative Gold Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0B1F3A] via-[#C9A84C] to-[#0B1F3A]" />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Country Badge + Approved Pill */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {approval.isPlaceholder && (
                <span className="bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  SAMPLE
                </span>
              )}
              {/* Country Badge */}
              <div className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border border-white/20">
                <span className="text-base leading-none">{countryFlag}</span>
                <span className="tracking-wide">{countryName}</span>
              </div>
            </div>

            {/* Approved Pill */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100" />
              <span>Approved</span>
            </div>
          </div>

          {/* Student Info Box (Avatar + Name) */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl border-2 border-[#C9A84C]/40 shadow-md overflow-hidden bg-[#0B1F3A] flex items-center justify-center">
                {approval.photo ? (
                  <img
                    src={approval.photo}
                    alt={approval.studentName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="text-white font-black text-lg">{initials}</span>
              </div>
            </div>

            <div className="overflow-hidden">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-tight truncate">
                {approval.studentName}
              </h3>
            </div>
          </div>

          {/* University, Course, Approval Date */}
          <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-4 mb-6 space-y-2.5 text-xs sm:text-sm">
            {approval.university && (
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span className="flex items-center gap-2 text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>University</span>
                </span>
                <strong className="text-[#0B1F3A] font-bold truncate max-w-[55%] text-right">
                  {approval.university}
                </strong>
              </div>
            )}

            {approval.course && (
              <div className="flex items-center justify-between text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-2 text-slate-500">
                  <Award className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>Course</span>
                </span>
                <strong className="text-[#0B1F3A] font-bold truncate max-w-[55%] text-right">
                  {approval.course}
                </strong>
              </div>
            )}

            {formattedDate && (
              <div className="flex items-center justify-between text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Approval Date</span>
                </span>
                <span className="text-slate-800 font-semibold">{formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Bottom: "Approved" on left, "View Story" on right if storyId exists */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Approved</span>
          </div>

          {approval.storyId && (
            <Link
              to={`/success-stories#${approval.storyId}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors cursor-pointer hover:underline"
            >
              <span>View Story</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

