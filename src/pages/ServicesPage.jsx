import React from 'react';
import { Helmet } from 'react-helmet-async';
import { overviewData } from '../data/servicePages/overview';
import Breadcrumb from '../components/shared/Breadcrumb';
import ServiceSections from '../components/shared/ServiceSections';
import ActionButton from '../components/shared/serviceSections/ActionButton';

export default function ServicesPage() {
  const { seo, hero, sections } = overviewData;

  const heroImage = hero?.image;
  const heroTitle = hero?.h1 || 'Our Services';
  const heroSub = hero?.sub;
  const heroButtons = hero?.buttons || [];

  return (
    <>
      <Helmet>
        <title>{`${seo?.title || 'Our Services'} | Adam International`}</title>
        <meta
          name="description"
          content={
            seo?.description ||
            'Study abroad support from Adam International: career counselling, admission, financial and visa guidance, travel and pre-departure support.'
          }
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-[#0B1F3A] text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Background Image with Navy Overlay */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/40 pointer-events-none" />
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb: Home / Services */}
          <div className="mb-4 sm:mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services' },
              ]}
            />
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
              {heroTitle}
            </h1>
            {heroSub && (
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
                {heroSub}
              </p>
            )}
          </div>

          {/* Hero Action Buttons */}
          {heroButtons.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-2">
              {heroButtons.slice(0, 2).map((btn, idx) => (
                <ActionButton
                  key={idx}
                  action={btn.action}
                  label={btn.label}
                  variant={btn.variant || (idx === 0 ? 'primary' : 'secondary')}
                  size="lg"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Data-Driven Sections from overview.js exactly as Section 5.1 */}
      <ServiceSections sections={sections} />
    </>
  );
}
