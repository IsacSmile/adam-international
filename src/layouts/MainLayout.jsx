import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/shared/ScrollToTop';
import { useAppointment } from '../context/AppointmentContext';
import SectionSkeleton from '../components/SectionSkeleton';

const AppointmentModal = lazy(() => import('../components/AppointmentModal'));

export default function MainLayout() {
  const { openAppointment } = useAppointment();
  const isPrelaunch = import.meta.env.VITE_PRELAUNCH === 'true';

  return (
    <div className="min-h-screen bg-white font-sans text-brandText antialiased flex flex-col justify-between">
      {isPrelaunch && (
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      )}
      <ScrollToTop />
      
      {/* Sticky Header with navigation & CTA */}
      <Header onBookAppointment={() => openAppointment()} />

      {/* Main page content routed via react-router */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Site Footer */}
      <Footer onOpenModal={() => openAppointment()} />

      {/* Global Appointment Consultation Modal */}
      <Suspense fallback={null}>
        <AppointmentModal />
      </Suspense>
    </div>
  );
}
