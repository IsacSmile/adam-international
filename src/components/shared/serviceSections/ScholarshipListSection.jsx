import React from 'react';
import { ExternalLink, Award } from 'lucide-react';
import { scholarships } from '../../../data/scholarships';
import ActionButton from './ActionButton';

export default function ScholarshipListSection({
  id,
  heading = 'Scholarships and Financial Aid',
  sub = 'Many universities and organisations offer scholarships and other financial support. We help you find the ones you may qualify for.',
}) {
  const list = scholarships || [];

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

        {/* Fallback when empty */}
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mb-6">
              Scholarship options depend on your country, university and profile. Ask us and we'll check what you may be eligible for.
            </p>
            <ActionButton
              action={{ type: 'appointment', service: 'financial-assistance' }}
              label="Explore Scholarship Opportunities"
              variant="navy"
              size="md"
              icon={true}
            />
          </div>
        ) : (
          /* Cards when scholarships exist */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((sch, idx) => (
              <div
                key={sch.name || idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F3A] mb-1">
                    {sch.name}
                  </h3>
                  {sch.provider && (
                    <div className="text-xs text-slate-500 font-medium mb-4">
                      Provider: {sch.provider} • {sch.country}
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
                    {sch.eligibility && (
                      <div>
                        <span className="font-bold text-[#0B1F3A]">Eligibility:</span> {sch.eligibility}
                      </div>
                    )}
                    {sch.academicRequirements && (
                      <div>
                        <span className="font-bold text-[#0B1F3A]">Requirements:</span> {sch.academicRequirements}
                      </div>
                    )}
                    {sch.deadline && (
                      <div>
                        <span className="font-bold text-[#0B1F3A]">Deadline:</span> {sch.deadline}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {sch.officialUrl ? (
                    <a
                      href={sch.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0B1F3A] hover:text-[#C9A84C] inline-flex items-center gap-1"
                    >
                      <span>Official details</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span />}

                  {sch.lastChecked && (
                    <span className="text-[10px] text-slate-400">
                      Last checked {sch.lastChecked}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
