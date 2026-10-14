import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  GraduationCap,
  BookOpenCheck,
  Wallet,
  FileCheck2,
  Plane,
  Luggage,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const iconMap = {
  Compass,
  GraduationCap,
  BookOpenCheck,
  Wallet,
  FileCheck2,
  Plane,
  Luggage,
};

export default function ServiceCard({ service, compact = false }) {
  if (!service) return null;

  const IconComponent = iconMap[service.icon] || Compass;

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group bg-white rounded-[20px] border border-slate-200/90 shadow-[0_4px_20px_rgba(11,31,58,0.05)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.12)] hover:border-[#C9A84C] transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1.5 h-full"
    >
      {/* 1. TOP IMAGE AREA */}
      <div className={`relative ${compact ? 'h-36 sm:h-40' : 'h-44 sm:h-48'} w-full overflow-hidden bg-slate-100`}>
        <img
          src={service.image}
          alt={service.title}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-[#0B1F3A]/20 to-transparent pointer-events-none" />

        {/* Icon Floating Badge */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center shadow-lg border border-[#C9A84C]/40 group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] transition-colors duration-300">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* 2. CARD BODY CONTENT */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Service Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] mb-2 leading-snug group-hover:text-[#C9A84C] transition-colors">
            {service.title}
          </h3>

          {/* Service Summary */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal mb-4">
            {service.card?.summary || service.intro}
          </p>

          {/* Highlights Checklist */}
          {service.card?.highlights && service.card.highlights.length > 0 && (
            <div className="space-y-2 mb-4 pt-3 border-t border-slate-100">
              {service.card.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-[#0B1F3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. CARD ACTION LINK */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
          <span>Explore Service</span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#C9A84C] group-hover:text-[#0B1F3A] flex items-center justify-center transition-colors">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
