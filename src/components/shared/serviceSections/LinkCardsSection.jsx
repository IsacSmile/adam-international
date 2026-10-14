import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '../../../data/services';
import { getIconComponent } from './iconMap';

export default function LinkCardsSection({
  id,
  heading = 'How We Can Help',
  sub,
  cards = [],
  items = [],
}) {
  const cardList = cards.length > 0 ? cards : items;

  const resolvedCards = cardList
    .map((item) => {
      if (typeof item === 'string') {
        const found = services.find(
          (s) =>
            s.slug === item ||
            s.title.toLowerCase() === item.toLowerCase() ||
            s.slug.replace(/-/g, ' ') === item.toLowerCase().replace(/-/g, ' ')
        );
        return found
          ? {
              title: found.title,
              slug: found.slug,
              icon: found.icon,
              tagline: found.card?.tagline || found.card?.description,
            }
          : { title: item, slug: item.toLowerCase().replace(/\s+/g, '-') };
      }
      return item;
    })
    .filter(Boolean);

  if (resolvedCards.length === 0) return null;

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

        {/* Link Cards Grid */}
        <div className={`grid grid-cols-1 ${resolvedCards.length === 2 ? 'sm:grid-cols-2' : resolvedCards.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {resolvedCards.map((card, idx) => {
            const Icon = getIconComponent(card.icon);
            const toUrl = card.to || (card.slug?.startsWith('/') ? card.slug : `/services/${card.slug}`);

            return (
              <Link
                key={idx}
                to={toUrl}
                className="bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-[#C9A84C] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0B1F3A] mb-4 group-hover:bg-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-snug">
                    {card.title}
                  </h3>

                  {card.tagline && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {card.tagline}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A84C]">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
