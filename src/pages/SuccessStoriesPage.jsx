import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, ArrowRight } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import StoryCard from '../components/shared/StoryCard';
import VisaApprovalCard from '../components/shared/VisaApprovalCard';
import YouTubeFacade from '../components/shared/YouTubeFacade';
import Lightbox from '../components/shared/Lightbox';
import { useLenis } from '../components/SmoothScroll';
import { successStories } from '../data/successStories';
import { visaApprovals } from '../data/visaApprovals';
import { countries } from '../data/countries';
import { useAppointment } from '../context/AppointmentContext';

export default function SuccessStoriesPage() {
  const location = useLocation();
  const lenis = useLenis();
  const { openAppointment } = useAppointment();

  const [selectedCountry, setSelectedCountry] = useState('all');

  // Lightbox state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    index: 0,
  });

  // Only countries that have at least one story
  const availableCountries = useMemo(() => {
    return countries.filter((country) =>
      successStories.some((s) => s.country === country.slug)
    );
  }, []);

  // Filtered stories based on country chip
  const filteredStories = useMemo(() => {
    if (selectedCountry === 'all') return successStories;
    return successStories.filter((s) => s.country === selectedCountry);
  }, [selectedCountry]);

  // Only stories with a video (for the "Featured videos" strip)
  const storiesWithVideo = useMemo(() => {
    return successStories.filter((s) => Boolean(s.video));
  }, []);

  // Handle scrolling to hash anchor (#adith-dinesh, etc.) with Lenis & header offset
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');

      // If the target story is in a specific country, ensure it isn't filtered out
      const matchingStory = successStories.find((s) => s.id === targetId);
      if (matchingStory && selectedCountry !== 'all' && matchingStory.country !== selectedCountry) {
        setSelectedCountry('all');
      }

      const scrollToAnchor = () => {
        const el = document.getElementById(targetId);
        if (el) {
          const headerEl = document.querySelector('header');
          const headerHeight = headerEl ? headerEl.offsetHeight : 80;
          const activeLenis = lenis || (typeof window !== 'undefined' ? window.__lenis : null);

          if (activeLenis) {
            activeLenis.scrollTo(el, { offset: -headerHeight - 20, duration: 1.2 });
          } else {
            const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      };

      scrollToAnchor();
      const t1 = setTimeout(scrollToAnchor, 150);
      const t2 = setTimeout(scrollToAnchor, 400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [location.hash, lenis]);

  const handleOpenLightbox = (images, index) => {
    setLightboxState({
      isOpen: true,
      images,
      index,
    });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleIndexChange = (newIndex) => {
    setLightboxState((prev) => ({ ...prev, index: newIndex }));
  };

  return (
    <>
      <Helmet>
        <title>Student success stories | Adam International</title>
        <meta
          name="description"
          content="Real students, real offers, real visas. Here's how it went for them, in their own words."
        />
      </Helmet>

      {/* Navy Page Hero Band */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Success Stories' },
        ]}
        title="Student success stories"
        subtitle="Real students, real offers, real visas. Here's how it went for them, in their own words."
      />

      <div className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          {/* Country Filter Chips: All + countries with at least one story */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 sm:mb-12">
            <button
              type="button"
              onClick={() => setSelectedCountry('all')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>All</span>
            </button>

            {availableCountries.map((c) => {
              const isSelected = selectedCountry === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelectedCountry(c.slug)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span role="img" aria-label={c.name} className="text-base leading-none">
                    {c.flag}
                  </span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Featured Videos (ONLY if any story has a video) */}
          {storiesWithVideo.length > 0 && (
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mb-6">
                Featured videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storiesWithVideo.map((story) => (
                  <div key={story.id} className="space-y-2">
                    <YouTubeFacade videoId={story.video} title={`${story.studentName} Video Story`} />
                    <p className="text-sm font-bold text-[#0B1F3A]">{story.studentName}</p>
                    <p className="text-xs text-slate-500">{story.university}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Story List */}
          <div className="space-y-8 sm:space-y-10">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onImageClick={handleOpenLightbox}
              />
            ))}
          </div>

          {/* Visa Approvals Grid */}
          <section className="mt-16 sm:mt-24 pt-16 border-t border-slate-200">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Recent visa approvals
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {visaApprovals.map((approval) => (
                <VisaApprovalCard key={approval.id} approval={approval} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* CTA SECTION (Replaces FinalCtaBanner on this page) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1F3A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1240px] mx-auto relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6">
            Want to be the next story here?
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => openAppointment()}
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>Book Free Counseling</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>

            <a
              href="https://wa.me/919895890500"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-xl shadow-md transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        currentIndex={lightboxState.index}
        onClose={handleCloseLightbox}
        onIndexChange={handleIndexChange}
      />
    </>
  );
}
