import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionSkeleton from '../components/SectionSkeleton';
import { useAppointment } from '../context/AppointmentContext';

const HeroShowcase = lazy(() => import('../components/HeroShowcase'));
const WhyChooseUsSection = lazy(() => import('../components/WhyChooseUsSection'));
const ServicesSection = lazy(() => import('../components/ServicesSection'));
const UniversityPartnersSection = lazy(() => import('../components/UniversityPartnersSection'));
const VisaSuccessSection = lazy(() => import('../components/VisaSuccessSection'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const HomeUpcomingEventsStrip = lazy(() => import('../components/home/HomeUpcomingEventsStrip'));
const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

export default function HomePage() {
  const { openAppointment } = useAppointment();

  return (
    <>
      <Helmet>
        <title>Overseas Education Consultancy in Kochi, Kerala | Adam International</title>
        <meta
          name="description"
          content="Adam International is an overseas education consultancy based in Kochi, Kerala helping students with university admissions, student visas, scholarships, and career counselling."
        />
      </Helmet>

      {/* Hero Showcase Content with Parallax Glow */}
      <Suspense fallback={<SectionSkeleton type="hero" />}>
        <HeroShowcase onBookAppointment={() => openAppointment()} />
      </Suspense>

      {/* Why Choose Adam International Section */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <WhyChooseUsSection onConsultClick={() => openAppointment()} />
      </Suspense>

      {/* Corporate Services Section */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <ServicesSection onSelectService={(service) => openAppointment({ service })} />
      </Suspense>

      {/* University Partners Section with Dark Glow Parallax */}
      <Suspense fallback={<SectionSkeleton type="dark" />}>
        <UniversityPartnersSection onViewAllUniversities={() => openAppointment()} />
      </Suspense>

      {/* Visa Success Stories Section */}
      <Suspense fallback={<SectionSkeleton type="visa" />}>
        <VisaSuccessSection onViewAllStories={() => openAppointment()} />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <TestimonialsSection />
      </Suspense>

      {/* Upcoming Events Strip */}
      <Suspense fallback={null}>
        <HomeUpcomingEventsStrip />
      </Suspense>

      {/* Conversion-Focused Final CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
