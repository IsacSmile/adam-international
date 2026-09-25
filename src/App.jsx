import React, { useState, useEffect, lazy, Suspense } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import SectionSkeleton from './components/SectionSkeleton';

const HeroShowcase = lazy(() => import('./components/HeroShowcase'));
const WhyChooseUsSection = lazy(() => import('./components/WhyChooseUsSection'));
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const UniversityPartnersSection = lazy(() => import('./components/UniversityPartnersSection'));
const VisaSuccessSection = lazy(() => import('./components/VisaSuccessSection'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const FinalCtaBanner = lazy(() => import('./components/FinalCtaBanner'));
const Footer = lazy(() => import('./components/Footer'));
const AppointmentModal = lazy(() => import('./components/AppointmentModal'));

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleGesture = (e) => {
      e.preventDefault();
    };
    document.addEventListener('gesturestart', handleGesture);
    document.addEventListener('gesturechange', handleGesture);
    document.addEventListener('gestureend', handleGesture);
    return () => {
      document.removeEventListener('gesturestart', handleGesture);
      document.removeEventListener('gesturechange', handleGesture);
      document.removeEventListener('gestureend', handleGesture);
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white font-sans text-brandText antialiased">
        {/* GSAP & Tailwind Powered Sticky Header */}
        <Header onBookAppointment={handleOpenModal} />

        {/* Hero Showcase Content with Parallax Glow */}
        <Suspense fallback={<SectionSkeleton type="hero" />}>
          <HeroShowcase onBookAppointment={handleOpenModal} />
        </Suspense>

        {/* Why Choose Adam International Section */}
        <Suspense fallback={<SectionSkeleton type="cards" />}>
          <WhyChooseUsSection onConsultClick={handleOpenModal} />
        </Suspense>

        {/* Corporate Services Section */}
        <Suspense fallback={<SectionSkeleton type="cards" />}>
          <ServicesSection onSelectService={handleOpenModal} />
        </Suspense>

        {/* University Partners Section with Dark Glow Parallax */}
        <Suspense fallback={<SectionSkeleton type="dark" />}>
          <UniversityPartnersSection onViewAllUniversities={handleOpenModal} />
        </Suspense>

        {/* Visa Success Stories Section */}
        <Suspense fallback={<SectionSkeleton type="visa" />}>
          <VisaSuccessSection onViewAllStories={handleOpenModal} />
        </Suspense>

        {/* Testimonials Section */}
        <Suspense fallback={<SectionSkeleton type="cards" />}>
          <TestimonialsSection />
        </Suspense>

        {/* Conversion-Focused Final CTA Banner */}
        <Suspense fallback={<SectionSkeleton type="cards" />}>
          <FinalCtaBanner onBookCounseling={handleOpenModal} />
        </Suspense>

        {/* Professional Footer Component */}
        <Suspense fallback={<SectionSkeleton type="dark" />}>
          <Footer onOpenModal={handleOpenModal} />
        </Suspense>

        {/* Appointment Consultation Modal */}
        <Suspense fallback={null}>
          <AppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </Suspense>
      </div>
    </SmoothScroll>
  );
}
