import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function TwoColumnListsSection({
  id,
  heading,
  sub,
  left,
  right,
  columns,
}) {
  const colList = columns || [left, right].filter(Boolean);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Section Header */}
        {(heading || sub) && (
          <div className="max-w-3xl mb-12 sm:mb-16">
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
        )}

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {colList.map((col, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-[#0B1F3A] tracking-tight">
                  {col.title}
                </h3>
                {col.sub && (
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 italic font-normal">
                    {col.sub}
                  </p>
                )}

                <div className="mt-6 space-y-3.5">
                  {(col.items || []).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
