import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, Calendar, DollarSign, Award, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import VisaApprovalCard from '../components/shared/VisaApprovalCard';
import StoryCard from '../components/shared/StoryCard';
import SectionSkeleton from '../components/SectionSkeleton';
import RelatedPosts from '../components/blog/RelatedPosts';
import NotFoundPage from './NotFoundPage';
import { getVisibleUniversityBySlug } from '../lib/universities';
import { countries } from '../data/countries';
import { visaApprovals } from '../data/visaApprovals';
import { successStories } from '../data/successStories';
import { SHOW_PLACEHOLDERS } from '../lib/contentFlags';
import { useAppointment } from '../context/AppointmentContext';

const FinalCtaBanner = lazy(() => import('../components/FinalCtaBanner'));

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const { openAppointment } = useAppointment();

  const university = getVisibleUniversityBySlug(slug);

  // Matching visa approvals and success stories
  const matchingApprovals = useMemo(() => {
    if (!university) return [];
    const list = SHOW_PLACEHOLDERS
      ? visaApprovals
      : visaApprovals.filter((v) => !v.isPlaceholder);
    return list.filter((v) => v.universitySlug === university.slug);
  }, [university]);

  const matchingStories = useMemo(() => {
    if (!university) return [];
    const list = SHOW_PLACEHOLDERS
      ? successStories
      : successStories.filter((s) => !s.isPlaceholder);
    return list.filter((s) => s.universitySlug === university.slug);
  }, [university]);

  // Level filter state for programs table
  const [selectedLevel, setSelectedLevel] = useState('All');

  const availableLevels = useMemo(() => {
    if (!university?.programs || university.programs.length === 0) return [];
    const levels = Array.from(new Set(university.programs.map((p) => p.level).filter(Boolean)));
    return ['All', ...levels];
  }, [university?.programs]);

  const filteredPrograms = useMemo(() => {
    if (!university?.programs) return [];
    if (selectedLevel === 'All') return university.programs;
    return university.programs.filter((p) => p.level === selectedLevel);
  }, [university?.programs, selectedLevel]);

  // If university slug is not found, render NotFoundPage
  if (!university) {
    return <NotFoundPage />;
  }

  const countryObj = countries.find((c) => c.slug === university.country);
  const countryName = countryObj ? countryObj.name : university.country;
  const countryFlag = countryObj ? countryObj.flag : '🌍';

  const hasStudentsHelped = matchingApprovals.length > 0 || matchingStories.length > 0;

  // Check if almost every field is empty (placeholder pattern from Section 5.5)
  const hasFullDetails = Boolean(
    university.overview ||
    (university.programs && university.programs.length > 0) ||
    university.requirements?.academic ||
    university.tuition?.amount ||
    university.scholarships
  );

  return (
    <>
      <Helmet>
        <title>{`${university.name} | Adam International`}</title>
        <meta
          name="description"
          content={`Study at ${university.name} in ${university.city ? `${university.city}, ` : ''}${countryName}. Courses, admission requirements, fees, and student guidance.`}
        />
      </Helmet>

      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0B1F3A] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Cover image if available */}
        {university.coverImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={university.coverImage}
              alt={university.name}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-[#0B1F3A]/85 backdrop-blur-[2px]" />
          </div>
        )}

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/universities" className="hover:text-white transition-colors">Universities</Link>
            <span>/</span>
            <span className="text-[#C9A84C] font-semibold">{university.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Logo / Building Tile Fallback */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DFBE7A] shrink-0 shadow-md overflow-hidden">
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#C9A84C]" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {university.name}
                </h1>

                <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300 font-medium flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>{university.city ? `${university.city}, ${countryName}` : countryName}</span>
                  </div>
                  <span role="img" aria-label={countryName} className="text-base leading-none">
                    {countryFlag}
                  </span>
                </div>
              </div>
            </div>

            {/* Enquire Button */}
            <button
              type="button"
              onClick={() =>
                openAppointment({
                  university: university.slug,
                  country: university.country,
                })
              }
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-bold text-sm sm:text-base transition-colors shadow-lg cursor-pointer"
            >
              <span>Enquire about this university</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#F8FAFC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto space-y-12 sm:space-y-16">

          {/* If placeholder with almost all fields empty */}
          {!hasFullDetails && (
            <div id="requirements" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-5">
                <Building2 className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-2">
                {university.name}
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                {university.city ? `${university.city}, ` : ''}{countryName} {countryFlag}
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mb-6">
                Full details for this university are being updated. Talk to an advisor for current courses, fees and entry requirements.
              </p>
              <button
                type="button"
                onClick={() =>
                  openAppointment({
                    university: university.slug,
                    country: university.country,
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm sm:text-base transition-colors shadow-md cursor-pointer"
              >
                <span>Enquire</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </button>
            </div>
          )}

          {/* 2. OVERVIEW (Only if data exists) */}
          {hasFullDetails && university.overview && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-4">
                Overview
              </h2>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                {university.overview}
              </p>
            </section>
          )}

          {/* 3. COURSES / PROGRAMMES TABLE (Only if data exists) */}
          {hasFullDetails && university.programs && university.programs.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                  Courses / programmes
                </h2>

                {/* Level Filter */}
                {availableLevels.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {availableLevels.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                          selectedLevel === lvl
                            ? 'bg-[#0B1F3A] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4">Programme</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Intakes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredPrograms.map((prog, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">{prog.name}</td>
                        <td className="py-3.5 px-4">{prog.level}</td>
                        <td className="py-3.5 px-4">{prog.duration}</td>
                        <td className="py-3.5 px-4">{prog.intakes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards View */}
              <div className="md:hidden space-y-3">
                {filteredPrograms.map((prog, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <h3 className="font-bold text-[#0B1F3A] text-sm">{prog.name}</h3>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Level:</span>
                      <strong className="text-[#0B1F3A]">{prog.level}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Duration:</span>
                      <strong className="text-[#0B1F3A]">{prog.duration}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Intakes:</span>
                      <strong className="text-[#0B1F3A]">{prog.intakes}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. ENTRY REQUIREMENTS (Only if data exists) */}
          {hasFullDetails && university.requirements && (
            (university.requirements.academic || university.requirements.english || university.requirements.other) && (
              <section id="requirements" className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-6">
                  Entry requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {university.requirements.academic && (
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                      <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                        Academic
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {university.requirements.academic}
                      </p>
                    </div>
                  )}

                  {university.requirements.english && (
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                      <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                        English
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {university.requirements.english}
                      </p>
                    </div>
                  )}

                  {university.requirements.other && (
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                      <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                        Other
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {university.requirements.other}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )
          )}

          {/* 5. FEES & COSTS (Only if data exists) */}
          {hasFullDetails && (university.tuition?.amount || university.livingCost?.amount) && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-6">
                Fees & costs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {university.tuition?.amount && (
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Tuition Fee
                    </span>
                    <p className="text-2xl font-extrabold text-[#0B1F3A]">
                      {university.tuition.currency} {university.tuition.amount}{' '}
                      <span className="text-xs font-semibold text-slate-500">/ {university.tuition.per}</span>
                    </p>
                  </div>
                )}

                {university.livingCost?.amount && (
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Estimated Living Cost
                    </span>
                    <p className="text-2xl font-extrabold text-[#0B1F3A]">
                      {university.livingCost.currency} {university.livingCost.amount}{' '}
                      <span className="text-xs font-semibold text-slate-500">/ {university.livingCost.per}</span>
                    </p>
                  </div>
                )}
              </div>

              {(university.tuition?.note || university.livingCost?.note) && (
                <p className="text-xs text-slate-500 italic mt-3">
                  {university.tuition?.note || university.livingCost?.note}
                </p>
              )}
            </section>
          )}

          {/* 6. SCHOLARSHIPS (Only if data exists) */}
          {hasFullDetails && university.scholarships && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-3">
                Scholarships
              </h2>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                {university.scholarships}
              </p>
            </section>
          )}

          {/* 7. APPLICATION DEADLINES (Only if data exists) */}
          {hasFullDetails && university.applicationDeadlines && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-3">
                Application deadlines
              </h2>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                {university.applicationDeadlines}
              </p>
            </section>
          )}

          {/* 8. STUDENTS WE'VE HELPED HERE (Only if matching approvals or stories exist) */}
          {hasStudentsHelped && (
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Students we've helped here
              </h2>

              {/* Matching Visa Approvals */}
              {matchingApprovals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingApprovals.map((approval) => (
                    <VisaApprovalCard key={approval.id} approval={approval} />
                  ))}
                </div>
              )}

              {/* Matching Success Stories */}
              {matchingStories.length > 0 && (
                <div className="space-y-6 pt-4">
                  {matchingStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 9. FOOTER NOTE (Only if lastUpdated exists) */}
          {university.lastUpdated && (
            <div className="pt-4 text-xs sm:text-sm text-slate-500 border-t border-slate-200/80">
              <p>
                Fees and requirements change every year. Information last checked: {university.lastUpdated}. Please confirm with an advisor before applying.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Related Reading */}
      {university && (
        <RelatedPosts
          countrySlug={university.country}
          title="Related reading"
          className="bg-white border-t border-slate-200/80"
        />
      )}

      {/* Final Conversion CTA Banner */}
      <Suspense fallback={<SectionSkeleton type="cards" />}>
        <FinalCtaBanner onBookCounseling={() => openAppointment()} />
      </Suspense>
    </>
  );
}
