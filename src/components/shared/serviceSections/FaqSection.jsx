import React from 'react';
import FaqAccordion from '../FaqAccordion';

export default function FaqSection({
  id = 'faq',
  heading = 'Frequently Asked Questions',
  sub,
  items = [],
  faqs = [],
}) {
  const rawList = items.length > 0 ? items : faqs;
  const normalizedFaqs = rawList.map((item) => ({
    q: item.q || item.question || '',
    a: item.a || item.answer || '',
  })).filter((item) => item.q && item.a);

  if (normalizedFaqs.length === 0) return null;

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 text-center mx-auto">
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

        {/* Accordion Component with JSON-LD */}
        <FaqAccordion faqs={normalizedFaqs} />

      </div>
    </section>
  );
}
