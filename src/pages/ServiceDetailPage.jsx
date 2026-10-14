import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { services } from '../data/services';
import { servicePages } from '../data/servicePages';
import NotFoundPage from './NotFoundPage';
import Breadcrumb from '../components/shared/Breadcrumb';
import ServiceSections from '../components/shared/ServiceSections';
import ActionButton from '../components/shared/serviceSections/ActionButton';

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const serviceMeta = services.find((s) => s.slug === slug);
  const pageData = servicePages[slug];

  // If slug is not found in services data or servicePages, render 404 page
  if (!serviceMeta || !pageData) {
    return <NotFoundPage />;
  }

  const heroImage = pageData.hero?.image || serviceMeta.image;
  const heroTitle = pageData.hero?.h1 || pageData.hero?.title || serviceMeta.title;
  const heroSub = pageData.hero?.sub || pageData.hero?.subtitle;
  const heroButtons = pageData.hero?.buttons || [];

  return (
    <>
      <Helmet>
        <title>{`${pageData.seo?.title || serviceMeta.title} | Adam International`}</title>
        <meta
          name="description"
          content={pageData.seo?.description || serviceMeta.card?.description}
        />
      </Helmet>

      {/* 1. HERO SECTION (H1, sub, up to 2 buttons, image with navy overlay, breadcrumb) */}
      <section className="relative bg-[#0B1F3A] text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Background Image with Navy Overlay */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: pageData.hero?.objectPosition || 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/65 to-[#0B1F3A]/40 pointer-events-none" />
          </div>
        )}

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb: Home / Services / {title} */}
          <div className="mb-4 sm:mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: serviceMeta.title },
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

          {/* Up to 2 Hero Action Buttons */}
          {heroButtons.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-2">
              {heroButtons.slice(0, 2).map((btn, idx) => (
                <ActionButton
                  key={idx}
                  action={btn.action}
                  label={btn.label}
                  variant={btn.variant || (idx === 0 ? 'primary' : 'secondary')}
                  size="lg"
                  defaultService={serviceMeta.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. DATA-DRIVEN SECTIONS */}
      <ServiceSections
        sections={pageData.sections}
        defaultService={serviceMeta.slug}
      />

      {/* 3. CTA BAND */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1F3A] text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            Have a question about {serviceMeta.title}?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Talk to an advisor at any of our branches, on a call, or on WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <ActionButton
              action={{ type: 'appointment', service: serviceMeta.slug }}
              label="Book a Free Consultation"
              variant="primary"
              size="md"
              defaultService={serviceMeta.slug}
            />
            <ActionButton
              action={{ type: 'whatsapp' }}
              label="WhatsApp Us"
              variant="secondary"
              size="md"
              icon={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}
