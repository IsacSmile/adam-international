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
        <title>Adam International | Overseas Education &amp; Study Abroad Consultants Kochi, Kerala</title>
        <meta
          name="description"
          content="Adam International is an overseas education consultancy in Kochi, Kerala helping students with European university admissions, student visas, scholarships, and career counselling since 2008."
        />
        <meta
          name="keywords"
          content="Adam International, adma internation, adam international kochi, study abroad consultants kochi, overseas education consultancy kerala, study in europe kochi, european university admissions, student visa consultants"
        />
        <link rel="canonical" href="https://www.adaminternational.in/" />
        <meta property="og:title" content="Adam International | Premier Study Abroad Consultants Kochi" />
        <meta
          property="og:description"
          content="Helping students achieve their global academic dreams across European and global universities since 2008. Kochi, Kerala."
        />
        <meta property="og:url" content="https://www.adaminternational.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.adaminternational.in/logo234.webp" />
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
