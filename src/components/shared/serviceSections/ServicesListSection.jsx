import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { services } from '../../../data/services';
import { getIconComponent } from './iconMap';

export default function ServicesListSection({
  id = 'all-services',
  eyebrow = 'OUR SERVICES',
  heading = 'Everything We Help With',
  sub,
}) {
  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
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
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {sub}
            </p>
          )}
        </div>

        {/* 7 Detailed Cards (2 columns on desktop, 1 on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = getIconComponent(service.icon);
            const bullets = service.card?.bullets || [];

            return (
              <div
                key={service.slug}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between hover:border-[#C9A84C] hover:bg-white hover:shadow-[0_12px_28px_rgba(11,31,58,0.06)] transition-all group"
              >
                <div>
                  {/* Top Bar: Icon + Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors shadow-xs shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* Tagline (bold) */}
                  {service.card?.tagline && (
                    <div className="text-sm sm:text-base font-bold text-slate-800 mb-2">
                      {service.card.tagline}
                    </div>
                  )}

                  {/* Description */}
                  {service.card?.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                      {service.card.description}
                    </p>
                  )}

                  {/* Bullets List */}
                  {bullets.length > 0 && (
                    <div className="pt-4 border-t border-slate-200/70 space-y-2.5">
                      <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                        What we provide:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Learn More Link */}
                <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-end">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
