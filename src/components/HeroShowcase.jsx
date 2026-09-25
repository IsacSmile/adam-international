import React from 'react';
import { Globe, Award, ShieldCheck, BookOpen, ArrowUpRight } from 'lucide-react';

export default function HeroShowcase({ onBookAppointment }) {
  return (
    <main id="home" className="min-h-screen">
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0B1F3A] via-[#112D53] to-[#0B1F3A] text-white py-20 lg:py-28 px-5 lg:px-8 overflow-hidden">
        
        {/* Glow backdrop decorative SVG */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-4 py-1.5 rounded-full text-[#DFBE7A] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6">
            <Award className="w-4 h-4" />
            <span>Top-Tier Overseas Education Consultancy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Architect Your Academic Future With <span className="text-[#C9A84C]">Adam International</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Unlocking global educational opportunities with end-to-end university admissions, merit scholarship funding, and visa facilitation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBookAppointment}
              className="bg-[#C9A84C] hover:bg-[#B5943B] text-[#0B1F3A] font-bold text-base py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Book Free Counseling Session
            </button>
            <a
              href="#countries"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-base py-3.5 px-7 rounded-xl border border-white/20 transition-all duration-200"
            >
              <span>Explore Top Destinations</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-[1080px] mx-auto px-5 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">12,500+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Students Enrolled</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">98.4%</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Visa Success Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">450+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Partner Universities</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">$15M+</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Scholarships Awarded</div>
          </div>
        </div>
      </section>

      {/* Study Destinations Grid */}
      <section id="countries" className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1F3A] mb-3">
            Premier Study Destinations
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            Select from world-class university systems with high post-graduation employment rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { country: 'United Kingdom', flag: '🇬🇧', desc: '1-Year Master degrees & 2-Year Graduate Work Visas.' },
            { country: 'United States', flag: '🇺🇸', desc: 'Ivy League institutions & 3-Year STEM OPT extension.' },
            { country: 'Canada', flag: '🇨🇦', desc: 'Top rankings, PGWP work permits & express PR pathways.' },
            { country: 'Australia', flag: '🇦🇺', desc: 'High quality of life & extended post-study work rights.' },
          ].map((item) => (
            <div
              key={item.country}
              className="bg-white border border-gray-200 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="text-4xl mb-4">{item.flag}</div>
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-2 group-hover:text-[#C9A84C] transition-colors">
                {item.country}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
