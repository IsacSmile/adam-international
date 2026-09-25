import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import HeroShowcase from './components/HeroShowcase';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import ServicesSection from './components/ServicesSection';
import UniversityPartnersSection from './components/UniversityPartnersSection';
import VisaSuccessSection from './components/VisaSuccessSection';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCtaBanner from './components/FinalCtaBanner';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';

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
        <HeroShowcase onBookAppointment={handleOpenModal} />

        {/* Why Choose Adam International Section */}
        <WhyChooseUsSection onConsultClick={handleOpenModal} />

        {/* Corporate Services Section */}
        <ServicesSection onSelectService={handleOpenModal} />

        {/* University Partners Section with Dark Glow Parallax */}
        <UniversityPartnersSection onViewAllUniversities={handleOpenModal} />

        {/* Visa Success Stories Section */}
        <VisaSuccessSection onViewAllStories={handleOpenModal} />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Conversion-Focused Final CTA Banner */}
        <FinalCtaBanner onBookCounseling={handleOpenModal} />

        {/* Professional Footer Component */}
        <Footer onOpenModal={handleOpenModal} />

        {/* Appointment Consultation Modal */}
        <AppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </SmoothScroll>
  );
}
