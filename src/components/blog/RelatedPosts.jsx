import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { usePosts } from '../../hooks/useContent';
import { SHOW_PLACEHOLDERS } from '../../lib/contentFlags';

export default function RelatedPosts({ countrySlug, title, limit = 3, className = '' }) {
  const { data: postsData } = usePosts();

  const selectedPosts = useMemo(() => {
    if (!postsData || !Array.isArray(postsData)) return [];

    // 1. Published posts only
    let candidatePosts = postsData.filter((p) => !p.status || p.status === 'published');

    // 2. SAMPLE posts only when SHOW_PLACEHOLDERS is true
    if (!SHOW_PLACEHOLDERS) {
      candidatePosts = candidatePosts.filter((p) => !p.isPlaceholder && !p.isSample);
    }

    // Sort helper: newest first
    const sortByNewest = (a, b) => {
      const timeA = new Date(a.publishDate || a.date || a.createdAt || 0).getTime();
      const timeB = new Date(b.publishDate || b.date || b.createdAt || 0).getTime();
      return timeB - timeA;
    };

    const targetSlug = countrySlug ? String(countrySlug).trim().toLowerCase() : null;

    if (targetSlug) {
      // Posts tagged with that country first (newest first)
      const matchingPosts = candidatePosts
        .filter(
          (p) =>
            Array.isArray(p.countries) &&
            p.countries.some((c) => String(c).trim().toLowerCase() === targetSlug)
        )
        .sort(sortByNewest);

      const matchedIds = new Set(matchingPosts.map((p) => p.id || p.slug));

      // Fill with the newest other posts up to limit, no duplicates
      const otherPosts = candidatePosts
        .filter((p) => !matchedIds.has(p.id || p.slug))
        .sort(sortByNewest);

      return [...matchingPosts, ...otherPosts].slice(0, limit);
    }

    // Without countrySlug: newest posts up to limit
    return [...candidatePosts].sort(sortByNewest).slice(0, limit);
  }, [postsData, countrySlug, limit]);

  // If 0 posts after filtering: render NOTHING (no heading, no empty box)
  if (selectedPosts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors shrink-0 group"
          >
            <span>View all articles</span>
            <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedPosts.map((post) => (
            <BlogCard key={post.slug || post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
