import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SmoothScroll from './components/SmoothScroll';
import { AppointmentProvider } from './context/AppointmentContext';
import { ContentProvider } from './hooks/useContent';
import MainLayout from './layouts/MainLayout';
import SectionSkeleton from './components/SectionSkeleton';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const CountriesPage = lazy(() => import('./pages/CountriesPage'));
const CountryDetailPage = lazy(() => import('./pages/CountryDetailPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const UniversityDetailPage = lazy(() => import('./pages/UniversityDetailPage'));
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CreditsPage = lazy(() => import('./pages/CreditsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


// Admin routes lazy-loaded outside public bundle
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminEventsListPage = lazy(() => import('./pages/admin/AdminEventsListPage'));
const AdminEventEditorPage = lazy(() => import('./pages/admin/AdminEventEditorPage'));
const AdminBlogListPage = lazy(() => import('./pages/admin/AdminBlogListPage'));
const AdminBlogEditorPage = lazy(() => import('./pages/admin/AdminBlogEditorPage'));

export default function App() {
  useEffect(() => {
    // Preserve mobile pinch-zoom locking
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

  return (
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ContentProvider>
          <SmoothScroll>
            <AppointmentProvider>
              <Suspense fallback={<SectionSkeleton type="cards" />}>
              <Routes>
                {/* Admin routes (outside MainLayout - no public header or footer) */}
                <Route
                  path="/admin/login"
                  element={
                    <ErrorBoundary>
                      <AdminLoginPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <AdminRoute>
                      <AdminEventsListPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/events/new"
                  element={
                    <AdminRoute>
                      <AdminEventEditorPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/events/:id"
                  element={
                    <AdminRoute>
                      <AdminEventEditorPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <AdminRoute>
                      <AdminBlogListPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/blog/new"
                  element={
                    <AdminRoute>
                      <AdminBlogEditorPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/blog/:id"
                  element={
                    <AdminRoute>
                      <AdminBlogEditorPage />
                    </AdminRoute>
                  }
                />

                {/* Public site routes inside MainLayout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="countries" element={<CountriesPage />} />
                  <Route path="countries/:slug" element={<CountryDetailPage />} />

                  <Route path="services" element={<ServicesPage />} />
                  <Route path="services/:slug" element={<ServiceDetailPage />} />
                  <Route path="universities" element={<UniversitiesPage />} />
                  <Route path="universities/:slug" element={<UniversityDetailPage />} />
                  <Route path="success-stories" element={<SuccessStoriesPage />} />
                  <Route path="gallery" element={<GalleryPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="events/:slug" element={<EventDetailPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="credits" element={<CreditsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </AppointmentProvider>
        </SmoothScroll>
      </ContentProvider>
    </BrowserRouter>
  </HelmetProvider>
);
}
