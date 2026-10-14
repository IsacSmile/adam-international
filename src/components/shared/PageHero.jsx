import React from 'react';
import Breadcrumb from './Breadcrumb';
import { ArrowRight, Phone } from 'lucide-react';
import { contact } from '../../data/contact';

export default function PageHero({
  breadcrumbItems = [],
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  actions,
  children,
}) {
  return (
    <div className="relative bg-[#0B1F3A] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
      {/* Ambient Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}

        {/* Badge Pill (Optional) */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 rounded-full text-[#DFBE7A] text-[11px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-sm mb-4">
            <span>{badge}</span>
          </div>
        )}

        {/* Heading & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons (Optional) */}
        {actions ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-2">
            {actions}
          </div>
        ) : (primaryAction || secondaryAction) ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-2">
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>{primaryAction.label || 'Enquire Now'}</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
              </button>
            )}

            {secondaryAction && (
              <a
                href={secondaryAction.href || `tel:${contact.phoneTel}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-[#C9A84C]" />
                <span>{secondaryAction.label || `Call ${contact.phoneDisplay}`}</span>
              </a>
            )}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
