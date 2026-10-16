import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatBlogDate } from '../../lib/blog';

export default function BlogCard({ post }) {
  if (!post) return null;

  const formattedDate = formatBlogDate(post.date);

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">
      <Link
        to={`/blog/${post.slug}`}
        className="flex flex-col h-full text-inherit no-underline"
      >
        {/* Featured Image Container (16:9) */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 shrink-0">
          {post.image ? (
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
              No image
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Category tag & date line */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5 flex-wrap">
            {post.category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B1F3A]/5 text-[#0B1F3A]">
                {post.category}
              </span>
            )}
            {formattedDate && (
              <span className="text-slate-500 font-medium">{formattedDate}</span>
            )}
            {post.readingTime && (
              <span className="text-slate-400">· {post.readingTime} min read</span>
            )}
          </div>

          {/* Title (clamped to 2 lines) */}
          <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-2 leading-snug">
            {post.title}
          </h3>

          {/* Summary (clamped to exactly 2 lines) */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 font-normal">
            {post.summary}
          </p>

          {/* Read More link (pinned to bottom) */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
