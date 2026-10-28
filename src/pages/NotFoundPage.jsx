import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-gray-50/50">
      <Helmet>
        <title>Page Not Found | Adam International</title>
        <meta name="description" content="The page you are looking for does not exist. Explore our study abroad services or return to the homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-16 h-16 bg-[#C9A84C]/15 text-[#0B1F3A] rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#C9A84C]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">404 Error</span>
          <h1 className="text-3xl font-extrabold text-[#0B1F3A]">Page Not Found</h1>
          <p className="text-sm text-gray-600">
            The page you're looking for doesn't exist or has moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#071324] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  );
}
