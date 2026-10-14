import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { services } from '../data/services';
import { useAppointment } from '../context/AppointmentContext';
import NotFoundPage from './NotFoundPage';
import PageHero from '../components/shared/PageHero';
import ServiceCard from '../components/shared/ServiceCard';
import StepsTimeline from '../components/shared/StepsTimeline';
import FaqAccordion from '../components/shared/FaqAccordion';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { openAppointment } = useAppointment();

  const service = services.find((s) => s.slug === slug);

  // If slug is not found in services data, render 404 page
  if (!service) {
    return <NotFoundPage />;
  }

  // 3 other services to showcase at the bottom
  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{`${service.seo?.title || service.title} | Adam International`}</title>
        <meta
          name="description"
          content={service.seo?.description || service.card?.summary}
        />
      </Helmet>

      {/* 1. HERO SECTION */}
      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
        title={service.title}
        subtitle={service.hero?.subtitle}
        primaryAction={{
          label: 'Enquire Now',
          onClick: () => openAppointment({ service: service.slug }),
        }}
        secondaryAction={{
          label: 'Call +91 9895 890 500',
          href: 'tel:+919895890500',
        }}
      />

      {/* 2. INTRO SECTION */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Intro Text */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {service.intro}
              </p>
            </div>

            {/* Intro Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-[4/3]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INCLUDED SECTION */}
      {service.includes && service.includes.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                What's included
              </h2>
            </div>

            {/* 2-column checklist grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {service.includes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 sm:p-5 bg-white rounded-xl border border-slate-200/90 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-slate-800 font-medium leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW WE HELP SECTION */}
      {service.howWeHelp && service.howWeHelp.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                How we help
              </h2>
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {service.howWeHelp.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW IT WORKS SECTION */}
      {service.steps && service.steps.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                How it works
              </h2>
            </div>

            {/* Animated GSAP Timeline */}
            <StepsTimeline steps={service.steps} />
          </div>
        </section>
      )}

      {/* 6. WHY IT HELPS SECTION */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Why it helps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#C9A84C]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#C9A84C] flex items-center justify-center font-bold text-sm mb-4 shadow">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1F3A] mb-2 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. QUESTIONS STUDENTS ASK SECTION */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Questions students ask
              </h2>
            </div>

            {/* Accessible FAQ Accordion */}
            <FaqAccordion faqs={service.faqs} />
          </div>
        </section>
      )}

      {/* 8. OTHER SERVICES SECTION */}
      {otherServices.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                  Other services
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {otherServices.map((other) => (
                <ServiceCard key={other.slug} service={other} compact={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. SERVICE-SPECIFIC CTA BAND */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#0B1F3A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1240px] mx-auto relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Have a question about {service.title}?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Talk to an advisor at any of our branches, on a call, or on WhatsApp. The first consultation is free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => openAppointment({ service: service.slug })}
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>

            <a
              href="https://wa.me/919895890500"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-md transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
