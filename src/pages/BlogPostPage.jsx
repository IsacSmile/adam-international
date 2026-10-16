import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Breadcrumb from '../components/shared/Breadcrumb';
import BlogCard from '../components/blog/BlogCard';
import NotFoundPage from './NotFoundPage';
import { getPostBySlug, getAllPosts, formatBlogDate } from '../lib/blog';
import { whatsappLink } from '../data/contact';
import { useAppointment } from '../context/AppointmentContext';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { openAppointment } = useAppointment();
  const pageRef = useRef(null);

  const post = getPostBySlug(slug);

  // GSAP context cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {}, pageRef);
    return () => ctx.revert();
  }, [slug]);

  // If unknown slug or placeholder filtered out, render 404
  if (!post) {
    return <NotFoundPage />;
  }

  const formattedDate = formatBlogDate(post.date);
  const formattedUpdated = post.updated ? formatBlogDate(post.updated) : null;
  const showUpdated = formattedUpdated && post.updated !== post.date;

  // Breadcrumb items: Home / Blog / {category}
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    {
      label: post.category,
      href: post.categorySlug ? `/blog?category=${post.categorySlug}` : '/blog',
    },
  ];

  // Related articles: up to 3 from same category, filled with newest
  const allPosts = getAllPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug);
  const sameCategoryPosts = otherPosts.filter(
    (p) =>
      p.categorySlug === post.categorySlug ||
      p.category?.toLowerCase() === post.category?.toLowerCase()
  );

  let related = [...sameCategoryPosts];
  if (related.length < 3) {
    for (const p of otherPosts) {
      if (!related.some((r) => r.slug === p.slug)) {
        related.push(p);
        if (related.length === 3) break;
      }
    }
  }
  const relatedPosts = related.slice(0, 3);

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Organization',
      name: post.author || 'Adam International Team',
    },
    image: post.image,
  };

  return (
    <div ref={pageRef} className="bg-white min-h-screen">
      <Helmet>
        <title>{`${post.title} | Adam International`}</title>
        <meta name="description" content={post.summary} />

        {/* OpenGraph tags */}
        <meta property="og:title" content={`${post.title} | Adam International`} />
        <meta property="og:description" content={post.summary} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />

        {/* noindex if isPlaceholder is true */}
        {post.isPlaceholder && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {/* Article JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
      </Helmet>

      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-[#0B1F3A] py-6 sm:py-8 border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[820px] mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* 2. Article Header */}
      <header className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[820px] mx-auto space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {post.category && (
              <Link
                to={post.categorySlug ? `/blog?category=${post.categorySlug}` : '/blog'}
                className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#0B1F3A] text-white hover:bg-[#13335F] transition-colors"
              >
                {post.category}
              </Link>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 font-medium pt-1 pb-2 border-b border-slate-200">
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
                <span>{formattedDate}</span>
              </div>
            )}
            {post.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C9A84C]" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C9A84C]" />
                <span>{post.author}</span>
              </div>
            )}
            {showUpdated && (
              <span className="text-slate-400 italic">
                (Updated {formattedUpdated})
              </span>
            )}
          </div>

          {/* Featured Image (full width, 16:9, rounded) */}
          {post.image && (
            <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* 3. Article Content (Centred, max-w ~720px, scoped typography) */}
      <main className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <article className="max-w-[720px] mx-auto break-words">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* 4. Inline CTA Box */}
          <div className="mt-12 sm:mt-16 bg-[#F8FAFC] border-2 border-[#0B1F3A]/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#0B1F3A]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Guidance & Advisory</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Planning to Study in Europe?
              </h3>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                Get guidance from Adam International.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={openAppointment}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>Book a Free Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
                </button>

                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition-colors shadow-md active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* 5. Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F8FAFC] py-14 sm:py-18 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1240px] mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] block mb-1">
                  Keep Reading
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                  Related Articles
                </h2>
              </div>

              {/* 6. Link: Back to all articles */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to all articles</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback Back to all articles link when related section is empty */}
      {relatedPosts.length === 0 && (
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all articles</span>
          </Link>
        </div>
      )}

      {/* Scoped CSS for blog typography */}
      <style>{`
        .blog-prose {
          color: #334155;
          font-size: 1.0625rem;
          line-height: 1.75;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        @media (max-width: 640px) {
          .blog-prose {
            font-size: 1rem;
            line-height: 1.7;
          }
        }
        .blog-prose h2 {
          color: #0B1F3A;
          font-size: 1.625rem;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 2.25rem;
          margin-bottom: 0.875rem;
          letter-spacing: -0.02em;
        }
        @media (max-width: 640px) {
          .blog-prose h2 {
            font-size: 1.375rem;
            margin-top: 1.75rem;
          }
        }
        .blog-prose h3 {
          color: #0B1F3A;
          font-size: 1.3125rem;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 1.875rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        @media (max-width: 640px) {
          .blog-prose h3 {
            font-size: 1.1875rem;
            margin-top: 1.5rem;
          }
        }
        .blog-prose p {
          margin-bottom: 1.375rem;
        }
        .blog-prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.75rem;
          margin-bottom: 1.375rem;
        }
        .blog-prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.75rem;
          margin-bottom: 1.375rem;
        }
        .blog-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.65;
        }
        .blog-prose blockquote {
          border-left: 4px solid #C9A84C;
          background-color: #F8FAFC;
          padding: 1.125rem 1.375rem;
          border-radius: 0 1rem 1rem 0;
          margin-top: 1.75rem;
          margin-bottom: 1.75rem;
          font-style: italic;
          color: #1E293B;
        }
        .blog-prose a {
          color: #0B1F3A;
          text-decoration: underline;
          text-decoration-color: #C9A84C;
          text-underline-offset: 3px;
          text-decoration-thickness: 2px;
          font-weight: 600;
          transition: color 0.2s;
        }
        .blog-prose a:hover {
          color: #C9A84C;
        }
        .blog-prose strong {
          color: #0B1F3A;
          font-weight: 700;
        }
        .blog-prose em {
          font-style: italic;
        }
        .blog-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin-top: 1.75rem;
          margin-bottom: 1.75rem;
        }
        .blog-prose table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1.75rem;
          margin-bottom: 1.75rem;
          font-size: 0.875rem;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .blog-prose th {
          background-color: #0B1F3A;
          color: #FFFFFF;
          padding: 0.75rem 1rem;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
        }
        .blog-prose td {
          border-bottom: 1px solid #E2E8F0;
          padding: 0.75rem 1rem;
          color: #334155;
          min-width: 120px;
        }
        .blog-prose tr:nth-child(even) td {
          background-color: #F8FAFC;
        }
        .blog-prose hr {
          border: 0;
          height: 1px;
          background-color: #E2E8F0;
          margin-top: 2.25rem;
          margin-bottom: 2.25rem;
        }
      `}</style>
    </div>
  );
}
