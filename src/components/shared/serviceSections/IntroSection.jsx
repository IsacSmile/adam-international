import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export default function IntroSection({
  id,
  eyebrow,
  heading,
  sub,
  paragraphs,
  text,
  items,
  note,
  image,
}) {
  const textContent = paragraphs || (text ? (Array.isArray(text) ? text : [text]) : []);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        {image ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {eyebrow && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
                  {eyebrow}
                </span>
              )}

              {heading && (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
                  {heading}
                </h2>
              )}

              {sub && (
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {sub}
                </p>
              )}

              {textContent.length > 0 && (
                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                  {textContent.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {/* Optional Items List */}
              {items && items.length > 0 && (
                <div className="pt-2 space-y-2.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Note Box */}
              {note && (
                <div className="mt-4 p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-900 leading-relaxed text-left">
                  <Info className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{note}</div>
                </div>
              )}
            </div>

            {/* Optional Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-[4/3]">
                <img
                  src={image}
                  alt={heading || 'Section image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Centered Content Column without Image (~720px max width) */
          <div className="max-w-[720px] mx-auto text-center space-y-5">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
                {eyebrow}
              </span>
            )}

            {heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] leading-tight">
                {heading}
              </h2>
            )}

            {sub && (
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {sub}
              </p>
            )}

            {textContent.length > 0 && (
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {textContent.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Optional Items List */}
            {items && items.length > 0 && (
              <div className="pt-2 flex flex-col items-start max-w-lg mx-auto space-y-2.5 text-left">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Optional Note Box */}
            {note && (
              <div className="mt-4 p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-900 leading-relaxed text-left">
                <Info className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{note}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
