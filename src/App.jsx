import React, { useState } from 'react';
import Header from './components/Header';
import HeroShowcase from './components/HeroShowcase';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import ServicesSection from './components/ServicesSection';
import UniversityPartnersSection from './components/UniversityPartnersSection';
import VisaSuccessSection from './components/VisaSuccessSection';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCtaBanner from './components/FinalCtaBanner';
import AppointmentModal from './components/AppointmentModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brandText antialiased">
      {/* GSAP & Tailwind Powered Sticky Header */}
      <Header onBookAppointment={handleOpenModal} />

      {/* Hero Showcase Content */}
      <HeroShowcase onBookAppointment={handleOpenModal} />

      {/* Why Choose Adam International Section */}
      <WhyChooseUsSection onConsultClick={handleOpenModal} />

      {/* Corporate Services Section */}
      <ServicesSection onSelectService={handleOpenModal} />

      {/* University Partners Section */}
      <UniversityPartnersSection onViewAllUniversities={handleOpenModal} />

      {/* Visa Success Stories Section */}
      <VisaSuccessSection onViewAllStories={handleOpenModal} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Conversion-Focused Final CTA Banner */}
      <FinalCtaBanner onBookCounseling={handleOpenModal} />

      {/* Appointment Consultation Modal */}
      <AppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
