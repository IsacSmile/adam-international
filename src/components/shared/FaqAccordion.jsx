import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  if (!faqs || faqs.length === 0) return null;

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  // Structured Data Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const questionId = `faq-q-${idx}`;
          const answerId = `faq-a-${idx}`;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#C9A84C] shadow-md'
                  : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleItem(idx)}
                className="w-full text-left py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-1 rounded-2xl"
              >
                <span className="font-bold text-sm sm:text-base text-[#0B1F3A] leading-snug">
                  {faq.q}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? 'bg-[#0B1F3A] text-[#C9A84C] rotate-180'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80"
                >
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
