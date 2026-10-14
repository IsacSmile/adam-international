import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/shared/PageHero';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Adam International</title>
        <meta
          name="description"
          content="Terms and Conditions for Adam International Study Abroad Consultancy."
        />
      </Helmet>

      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' },
        ]}
        title="Terms & Conditions"
        subtitle="Terms and conditions governing our study abroad advisory services."
      />

      <div className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-[40vh]">
        <div className="max-w-[1240px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm max-w-3xl">
            {/* // TODO: replace with client-approved text before launch */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              This page is being updated. For any questions, email{' '}
              <a
                href="mailto:info@adaminternational.in"
                className="text-[#0B1F3A] font-semibold underline hover:text-[#C9A84C] transition-colors"
              >
                info@adaminternational.in
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
