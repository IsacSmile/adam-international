import React from 'react';

export default function SectionSkeleton({ type = 'cards' }) {
  if (type === 'hero') {
    return (
      <div className="bg-[#0B1F3A] min-h-[640px] py-12 px-6 lg:px-12 flex flex-col justify-between relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Skeleton Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill Badge Skeleton */}
            <div className="w-56 h-7 rounded-full animate-shimmer-dark" />
            
            {/* Title Lines Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="w-4/5 h-10 sm:h-12 rounded-xl animate-shimmer-dark" />
              <div className="w-3/5 h-10 sm:h-12 rounded-xl animate-shimmer-dark" />
            </div>

            {/* Paragraph Subtext Skeleton */}
            <div className="space-y-2 pt-2 max-w-lg">
              <div className="w-full h-4 rounded animate-shimmer-dark" />
              <div className="w-5/6 h-4 rounded animate-shimmer-dark" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="w-56 h-12 rounded-xl animate-shimmer-dark" />
              <div className="w-48 h-12 rounded-xl animate-shimmer-dark" />
            </div>
          </div>

          {/* Right Column Skeleton Card Stack */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <div className="grid grid-cols-2 gap-3 w-full max-w-[340px] h-[380px]">
              <div className="w-full h-full rounded-2xl animate-shimmer-dark" />
              <div className="w-full h-full rounded-2xl animate-shimmer-dark" />
            </div>
          </div>

        </div>

        {/* Bottom Floating Stats Strip Skeleton */}
        <div className="max-w-[1120px] mx-auto w-full mt-10 p-6 bg-white/5 rounded-2xl border border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-14 rounded-xl animate-shimmer-dark" />
          <div className="h-14 rounded-xl animate-shimmer-dark" />
          <div className="h-14 rounded-xl animate-shimmer-dark" />
          <div className="h-14 rounded-xl animate-shimmer-dark" />
        </div>
      </div>
    );
  }

  if (type === 'dark') {
    return (
      <div className="bg-[#0B1F3A] py-20 px-6 sm:px-12 border-t border-b border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="w-36 h-6 rounded-full mx-auto animate-shimmer-dark" />
          <div className="w-3/4 h-10 rounded-xl mx-auto animate-shimmer-dark" />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-44 rounded-2xl animate-shimmer-dark" />
          <div className="h-44 rounded-2xl animate-shimmer-dark" />
          <div className="h-44 rounded-2xl animate-shimmer-dark" />
          <div className="h-44 rounded-2xl animate-shimmer-dark" />
        </div>
      </div>
    );
  }

  if (type === 'visa') {
    return (
      <div className="bg-[#F8FAFC] py-20 px-6 sm:px-12 border-t border-b border-slate-200">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="w-44 h-7 rounded-full mx-auto animate-shimmer" />
          <div className="w-2/3 h-10 rounded-xl mx-auto animate-shimmer" />
        </div>
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-80 animate-shimmer" />
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-80 animate-shimmer" />
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-80 animate-shimmer" />
        </div>
      </div>
    );
  }

  // Default light cards layout skeleton
  return (
    <div className="bg-white py-20 px-6 sm:px-12 border-t border-b border-slate-100">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <div className="w-40 h-6 rounded-full mx-auto animate-shimmer" />
        <div className="w-3/4 h-9 rounded-xl mx-auto animate-shimmer" />
        <div className="w-1/2 h-4 rounded mx-auto animate-shimmer" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-2xl p-6 h-64 border border-slate-200/60 animate-shimmer" />
        <div className="bg-slate-50 rounded-2xl p-6 h-64 border border-slate-200/60 animate-shimmer" />
        <div className="bg-slate-50 rounded-2xl p-6 h-64 border border-slate-200/60 animate-shimmer" />
      </div>
    </div>
  );
}
