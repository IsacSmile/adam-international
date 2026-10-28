import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Camera, Scale, Globe2 } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import { imageCredits } from '../data/imageCredits';

export default function CreditsPage() {
  return (
    <>
      <Helmet>
        <title>Image Credits | Adam International</title>
        <meta
          name="description"
          content="Image credits, licensing, and attribution for media used on Adam International Study Abroad Consultancy."
        />
        <link rel="canonical" href="https://www.adaminternational.in/credits" />
      </Helmet>

      <PageHero
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Image Credits' },
        ]}
        title="Image Credits & Attribution"
        subtitle="We gratefully acknowledge the photographers and open-access contributors whose works illustrate educational destinations and institutions on our website."
      />

      <div className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          {/* Introductory notice card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">Open Content & Licensing Compliance</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
              Adam International uses photographs licensed under Creative Commons and the Unsplash License to showcase European universities and study destinations. In accordance with Creative Commons requirements (CC BY / CC BY-SA), each work is credited below with its verified author, source, and license.
            </p>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageCredits.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Thumbnail Preview */}
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.image}
                    alt={item.landmark}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1F3A]/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {item.section}
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A] leading-snug">
                      {item.landmark}
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                      <span>
                        Author: <strong className="text-slate-800">{item.author}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Scale className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                      <span>
                        Licence:{' '}
                        <a
                          href={item.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0B1F3A] font-semibold underline hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1"
                        >
                          {item.license}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        {item.changes && (
                          <span className="text-slate-500 font-normal ml-1">
                            — {item.changes}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Globe2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B1F3A] font-medium hover:text-[#C9A84C] hover:underline transition-colors inline-flex items-center gap-1"
                      >
                        View Source File
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
