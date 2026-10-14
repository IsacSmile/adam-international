import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import BlogCard from '../components/blog/BlogCard';
import { blogCategories } from '../data/blogCategories';
import { getAllPosts, formatBlogDate } from '../lib/blog';
import { useAppointment } from '../context/AppointmentContext';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(9);
  const { openAppointment } = useAppointment();
  const pageRef = useRef(null);

  const categoryParam = searchParams.get('category') || 'all';

  // GSAP context cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {}, pageRef);
    return () => ctx.revert();
  }, []);

  // Reset page limit when category changes
  useEffect(() => {
    setLimit(9);
  }, [categoryParam]);

  const allVisiblePosts = getAllPosts();

  // Find category chips with at least one visible post
  const availableCategories = blogCategories.filter((cat) =>
    allVisiblePosts.some(
      (p) =>
        p.categorySlug === cat.slug ||
        p.category?.toLowerCase() === cat.name.toLowerCase()
    )
  );

  // Filter posts based on categoryParam
  const isAllCategory = !categoryParam || categoryParam === 'all';
  const selectedCatObj = blogCategories.find((c) => c.slug === categoryParam);

  const filteredPosts = isAllCategory
    ? allVisiblePosts
    : allVisiblePosts.filter(
        (p) =>
          p.categorySlug === categoryParam ||
          (selectedCatObj &&
            p.category?.toLowerCase() === selectedCatObj.name.toLowerCase())
      );

  // Featured post shows ONLY when category is 'All' and a post with featured: true exists
  const featuredPost = isAllCategory
    ? filteredPosts.find((p) => p.featured)
    : null;

  // Exclude featured post from the grid when displayed above
  const gridPosts = featuredPost
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  const handleSelectCategory = (slug) => {
    if (!slug || slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: slug }, { replace: true });
    }
  };

  return (
    <div ref={pageRef} className="bg-white min-h-screen">
      <Helmet>
        <title>Study Abroad Insights & Updates | Adam International</title>
        <meta
          name="description"
          content="Study abroad updates, European university opportunities, visa guidance and student success stories from Adam International."
        />
      </Helmet>

      {/* 4.1 Hero */}
      <PageHero
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        title="Study Abroad Insights & Updates"
        subtitle="Explore European education, visa guidance and student resources."
      />

      {/* 4.2 Intro */}
      <section className="pt-12 sm:pt-16 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Explore the latest study abroad updates, European university opportunities, visa guidance and student success stories from Adam International.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {allVisiblePosts.length === 0 ? (
          /* Empty state when no visible posts exist (e.g. SHOW_PLACEHOLDERS is false) */
          <div className="my-12 bg-[#F8FAFC] rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-[#C9A84C]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-2">
              Articles are coming soon.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 font-normal">
              We are preparing helpful guides and university insights. Check back soon or speak with an advisor.
            </p>
            <button
              type="button"
              onClick={openAppointment}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold text-sm transition-colors shadow-md"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
            </button>
          </div>
        ) : (
          <>
            {/* 4.3 Category Bar */}
            <div className="py-6 border-b border-slate-200/80 mb-8 sm:mb-10">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
                <button
                  type="button"
                  onClick={() => handleSelectCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isAllCategory
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {availableCategories.map((cat) => {
                  const isActive = categoryParam === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4.4 Featured Post */}
            {featuredPost && (
              <section className="mb-10 sm:mb-12">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="grid grid-cols-1 lg:grid-cols-12 text-inherit no-underline"
                  >
                    {/* Image Column */}
                    <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-slate-100 min-h-[260px] sm:min-h-[340px]">
                      {featuredPost.isPlaceholder && (
                        <span className="absolute top-4 left-4 z-10 bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider pointer-events-none">
                          SAMPLE
                        </span>
                      )}
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.imageAlt || featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#0B1F3A]">
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                            <span>Featured Article</span>
                          </span>
                          {featuredPost.category && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0B1F3A]/5 text-[#0B1F3A]">
                              {featuredPost.category}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 font-medium">
                          {formatBlogDate(featuredPost.date)}
                          {featuredPost.readingTime && (
                            <span> · {featuredPost.readingTime} min read</span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {featuredPost.summary}
                        </p>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2 text-sm sm:text-base font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* 4.5 Post Grid or Category Empty State */}
            {filteredPosts.length === 0 ? (
              <div className="my-10 bg-[#F8FAFC] rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
                <p className="text-base sm:text-lg text-slate-700 font-semibold mb-4">
                  No articles in this category yet.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('all')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-xs sm:text-sm font-bold hover:bg-[#13335F] transition-colors cursor-pointer"
                >
                  <span>View all articles</span>
                </button>
              </div>
            ) : (
              <>
                {gridPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {gridPosts.slice(0, limit).map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}

                {/* Paging: Load more button */}
                {gridPosts.length > limit && (
                  <div className="text-center pt-10 sm:pt-12">
                    <button
                      type="button"
                      onClick={() => setLimit((prev) => prev + 9)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-[#0B1F3A] font-bold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer active:scale-98"
                    >
                      <span>Load more</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* 4.6 CTA Section (Replaces FinalCtaBanner on this page) */}
      <section className="w-full bg-[#0B1F3A] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/10 text-white text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-4 sm:space-y-5">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Planning to Study in Europe?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Get guidance from Adam International.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-3">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base transition-colors"
            >
              Contact Us
            </Link>

            <button
              type="button"
              onClick={openAppointment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-extrabold text-sm sm:text-base transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
