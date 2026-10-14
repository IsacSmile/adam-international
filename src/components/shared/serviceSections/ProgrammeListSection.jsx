import React from 'react';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { trainingProgrammes } from '../../../data/trainingProgrammes';
import ActionButton from './ActionButton';

export default function ProgrammeListSection({
  id,
  heading = 'Our Training Programmes',
  sub,
  formId = 'training-form',
}) {
  const programmes = trainingProgrammes || [];

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
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
        {programmes.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mb-6">
              Programme details are being updated. Use the form below to ask about current courses, batches and fees.
            </p>
            <ActionButton
              action={{ type: 'scroll', to: `#${formId}` }}
              label="Enquire About Training"
              variant="navy"
              size="md"
              icon={true}
            />
          </div>
        ) : (
          /* Cards when programmes exist */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmes.map((prog, idx) => (
              <div
                key={prog.slug || idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] hover:border-[#C9A84C] transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 leading-snug">
                    {prog.title}
                  </h3>

                  {prog.description && (
                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-5">
                      {prog.description}
                    </p>
                  )}

                  {/* Metadata table / rows */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-5">
                    {prog.eligibility && (
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Eligibility</span>
                        <span className="font-semibold text-slate-800">{prog.eligibility}</span>
                      </div>
                    )}
                    {prog.duration && (
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                        <span className="font-semibold text-slate-800">{prog.duration}</span>
                      </div>
                    )}
                    {prog.fee && (
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Fee</span>
                        <span className="font-semibold text-slate-800">{prog.fee}</span>
                      </div>
                    )}
                    {prog.format && (
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Format</span>
                        <span className="font-semibold text-slate-800">{prog.format}</span>
                      </div>
                    )}
                  </div>

                  {/* Outcomes list */}
                  {prog.outcomes && prog.outcomes.length > 0 && (
                    <div className="mb-5 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">What You'll Learn</span>
                      {prog.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Batches Table */}
                  {prog.batches && prog.batches.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Upcoming Batches</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="py-1 px-2">Start Date</th>
                              <th className="py-1 px-2">Schedule</th>
                              <th className="py-1 px-2">Mode</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {prog.batches.map((b, bi) => (
                              <tr key={bi}>
                                <td className="py-1 px-2 font-medium">{b.startDate}</td>
                                <td className="py-1 px-2 text-slate-600">{b.schedule}</td>
                                <td className="py-1 px-2 text-slate-600">{b.mode}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <ActionButton
                    action={{ type: 'scroll', to: `#${formId}` }}
                    label="Enquire About This Programme"
                    variant="navy"
                    size="sm"
                    icon={true}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
