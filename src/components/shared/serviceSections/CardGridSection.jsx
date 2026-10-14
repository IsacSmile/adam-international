import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getIconComponent } from './iconMap';
import ActionButton from './ActionButton';

export default function CardGridSection({
  id,
  eyebrow,
  heading,
  sub,
  intro,
  items = [],
  columns = 3,
  defaultService,
}) {
  const colClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Section Header */}
        {(eyebrow || heading || sub) && (
          <div className="max-w-3xl mb-10 sm:mb-12">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-2">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                {heading}
              </h2>
            )}
            {sub && (
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {sub}
              </p>
            )}
          </div>
        )}

        {/* Optional Intro Paragraph (e.g. Pre-Departure & Post-Landing cardGrid intro) */}
        {intro && (
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mb-8 -mt-4 font-normal">
            {intro}
          </p>
        )}

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 ${colClass} gap-5 sm:gap-6`}>
          {items.map((item, idx) => {
            const Icon = getIconComponent(item.icon);

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_12px_rgba(11,31,58,0.04)] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] hover:border-[#C9A84C]/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {item.icon && (
                    <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center mb-5 group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] leading-snug group-hover:text-[#C9A84C] transition-colors">
                    {item.title}
                  </h3>

                  {item.text && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.text}
                    </p>
                  )}
                </div>

                {/* Optional CTA Link or Button */}
                {(item.link || item.button || item.action) && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center">
                    {item.action || item.button ? (
                      <ActionButton
                        action={item.action || { type: 'appointment', service: defaultService }}
                        label={item.button || item.link?.label}
                        size="sm"
                        variant="navy"
                        icon={true}
                        defaultService={defaultService}
                      />
                    ) : item.link?.to ? (
                      <Link
                        to={item.link.to}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors group/link"
                      >
                        <span>{item.link.label || 'Learn More'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
