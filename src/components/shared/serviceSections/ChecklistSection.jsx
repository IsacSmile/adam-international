import React, { useState } from 'react';
import { Check, CheckCircle2, RotateCcw, Info } from 'lucide-react';

export default function ChecklistSection({
  id,
  heading,
  sub,
  items = [],
  interactive = false,
  note,
}) {
  const [checkedIndices, setCheckedIndices] = useState(() => new Set());

  const toggleItem = (idx) => {
    if (!interactive) return;
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCheckedIndices(new Set());
  };

  const checkedCount = checkedIndices.size;
  const totalCount = items.length;

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Header with interactive progress badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                {heading}
              </h2>
            )}
            {sub && (
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                {sub}
              </p>
            )}
          </div>

          {interactive && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#C9A84C]/15 text-[#0B1F3A] border border-[#C9A84C]/30">
                <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>
                  {checkedCount} of {totalCount} prepared
                </span>
              </span>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 underline cursor-pointer"
                  title="Reset checklist"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, idx) => {
            const isChecked = checkedIndices.has(idx);

            return (
              <div
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                  interactive
                    ? 'cursor-pointer select-none ' +
                      (isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                        : 'bg-slate-50 hover:bg-white hover:border-[#C9A84C] border-slate-200/80 text-slate-800')
                    : 'bg-slate-50 border-slate-200/80 text-slate-800'
                }`}
              >
                {interactive ? (
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                )}

                <span
                  className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                    interactive && isChecked ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        {note && (
          <div className="mt-6 sm:mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-500 italic flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5 not-italic" />
            <span className="leading-relaxed">{note}</span>
          </div>
        )}

      </div>
    </section>
  );
}
