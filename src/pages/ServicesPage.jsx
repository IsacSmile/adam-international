import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/shared/PageHero';
import ServiceCard from '../components/shared/ServiceCard';
import SectionSkeleton from '../components/SectionSkeleton';
import { services } from '../data/services';
import { useAppointment } from '../context/AppointmentContext';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

export default function ServicesPage() {
  const { openAppointment } = useAppointment();

  return (
    <>
      <Helmet>
        <title>Our Services | Adam International</title>
        <meta
          name="description"
          content="Seven ways we help, from your first question to your first week abroad."
        />
      </Helmet>

      {/* Navy Page Hero Band */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
        title="Our Services"
        subtitle="Seven ways we help, from your first question to your first week abroad."
      />

      {/* Services Grid (3 columns desktop, 1 column mobile) */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
