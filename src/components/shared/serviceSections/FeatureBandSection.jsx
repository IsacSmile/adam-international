import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import ActionButton from './ActionButton';

export default function FeatureBandSection({
  id,
  heading,
  text,
  items,
  button,
  action,
  to,
  defaultService,
}) {
  const buttonLabel = typeof button === 'string' ? button : button?.label || 'Explore';
  const buttonAction = action || (button?.action ? button.action : (to || button?.to ? { type: 'link', to: to || button?.to } : null));

  return (
    <section id={id} className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1240px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1F3A] via-[#13335F] to-[#0B1F3A] p-8 sm:p-12 lg:p-14 text-white shadow-xl overflow-hidden border border-[#C9A84C]/30">
          
          {/* Subtle decorative gold glow background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#C9A84C]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1E3A8A]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {heading}
            </h2>

            {text && (
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {text}
              </p>
            )}

            {/* Optional Items / Bullets */}
            {items && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Button */}
            {buttonAction && (
              <div className="pt-4">
                <ActionButton
                  action={buttonAction}
                  label={buttonLabel}
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
                  defaultService={defaultService}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
