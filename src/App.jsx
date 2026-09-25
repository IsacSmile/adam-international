import React, { useState } from 'react';
import Header from './components/Header';
import HeroShowcase from './components/HeroShowcase';
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
      {/* GSAP & Tailwind Powered Sticky Header Component */}
      <Header onBookAppointment={handleOpenModal} />

      {/* Hero Showcase Content */}
      <HeroShowcase onBookAppointment={handleOpenModal} />

      {/* Appointment Consultation Modal */}
      <AppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
