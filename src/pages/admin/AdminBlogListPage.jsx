import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  BookOpen,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X,
  Star,
  FileText,
  Clock,
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { formatBlogDate } from '../../lib/blog';

function formatIstDateTime(isoStr) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return String(isoStr);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return String(isoStr);
  }
}

export default function AdminBlogListPage({ admin }) {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const adminEmail = admin?.email || outletContext?.admin?.email || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'

  // Delete modal state
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content?type=posts', {
        credentials: 'same-origin',
      });
      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load blog posts');
      }
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      setError(err.message || 'Could not load blog posts');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOpenDelete = (post) => {
    setDeletePost(post);
  };

  const handleConfirmDelete = async () => {
    if (!deletePost) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/content?type=post&id=${encodeURIComponent(deletePost.id)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        }
      );
      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete blog post');
      }
      showToast(`Deleted "${deletePost.title}"`);
      setDeletePost(null);
      fetchPosts();
    } catch (err) {
      alert(err.message || 'Error deleting blog post');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Status filter
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = post.title?.toLowerCase().includes(q);
        const categoryMatch = post.category?.toLowerCase().includes(q);
        const slugMatch = post.slug?.toLowerCase().includes(q);
        const summaryMatch = post.summary?.toLowerCase().includes(q);
        if (!titleMatch && !categoryMatch && !slugMatch && !summaryMatch) {
          return false;
        }
      }
      return true;
    });
  }, [posts, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    let all = posts.length;
    let published = 0;
    let draft = 0;
    for (const p of posts) {
      if (p.status === 'published') published++;
      else if (p.status === 'draft') draft++;
    }
    return { all, published, draft };
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F3A] flex flex-col font-sans">
      <Helmet>
        <title>Blog Management | Adam International Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Shared Admin Header */}
      <AdminHeader adminEmail={adminEmail} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Title & Add New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Blog Posts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publish student visa guides, study destination insights, and European education news.
            </p>
          </div>

          <Link
            to="/admin/blog/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-sm font-bold shadow-sm transition-all hover:shadow active:scale-98 no-underline shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C9A84C]" />
            <span>New post</span>
          </Link>
        </div>

        {/* Toolbar: Search & Status Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, category, or slug…"
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>All</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    statusFilter === 'all'
                      ? 'bg-[#C9A84C] text-[#0B1F3A]'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {counts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  statusFilter === 'published'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>Published</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    statusFilter === 'published'
                      ? 'bg-white text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {counts.published}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  statusFilter === 'draft'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>Draft</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    statusFilter === 'draft'
                      ? 'bg-white text-slate-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {counts.draft}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <RefreshCw className="w-8 h-8 text-[#C9A84C] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading blog posts…</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p className="text-sm font-bold text-rose-900">{error}</p>
            <button
              type="button"
              onClick={fetchPosts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 flex items-center justify-center mx-auto text-[#0B1F3A]">
              <BookOpen className="w-7 h-7 text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B1F3A]">
                {posts.length === 0 ? 'No posts yet.' : 'No posts match your search.'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {posts.length === 0
                  ? 'Get started by creating your first blog article for students and parents.'
                  : 'Try adjusting your search query or status filter to see other posts.'}
              </p>
            </div>
            {posts.length === 0 && (
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-xs font-bold transition-all shadow-sm no-underline"
              >
                <Plus className="w-4 h-4" />
                <span>New post</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 pl-6 pr-3 w-16">Image</th>
                      <th className="py-3.5 px-3">Title</th>
                      <th className="py-3.5 px-3">Category</th>
                      <th className="py-3.5 px-3">Publish Date</th>
                      <th className="py-3.5 px-3 text-center">Featured</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-3">Last Updated (IST)</th>
                      <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredPosts.map((post) => {
                      const imageThumbUrl = post.imageThumb || post.image;
                      const pubDateLabel = formatBlogDate(post.publishDate || post.date) || '—';
                      const updatedLabel = formatIstDateTime(post.updatedAt || post.createdAt);
                      const isPublished = post.status === 'published';
                      const viewUrl = `/blog/${post.slug}${isPublished ? '' : '?preview=1'}`;

                      return (
                        <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Thumbnail */}
                          <td className="py-3 pl-6 pr-3">
                            <div className="w-12 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {imageThumbUrl ? (
                                <img
                                  src={imageThumbUrl}
                                  alt={post.imageAlt || post.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <FileText className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </td>

                          {/* Title & Badges */}
                          <td className="py-3 px-3">
                            <div className="flex flex-col gap-1 max-w-md">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  to={`/admin/blog/${post.id}`}
                                  className="font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors line-clamp-1 no-underline text-sm"
                                  title={post.title}
                                >
                                  {post.title}
                                </Link>
                                {post.isSample && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                                    SAMPLE
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                /{post.slug}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {post.category || 'General'}
                            </span>
                          </td>

                          {/* Publish Date */}
                          <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                            {pubDateLabel}
                          </td>

                          {/* Featured Star */}
                          <td className="py-3 px-3 text-center">
                            {post.featured ? (
                              <span
                                className="inline-flex items-center justify-center text-[#C9A84C]"
                                title="Featured post"
                              >
                                <Star className="w-4 h-4 fill-[#C9A84C]" />
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3">
                            {isPublished ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Published</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span>Draft</span>
                              </span>
                            )}
                          </td>

                          {/* Last Updated */}
                          <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                            {updatedLabel}
                          </td>

                          {/* Actions: Edit, View, Delete */}
                          <td className="py-3 pr-6 pl-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/admin/blog/${post.id}`}
                                className="p-1.5 text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit post"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>

                              <a
                                href={viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-500 hover:text-[#C9A84C] hover:bg-slate-100 rounded-lg transition-colors"
                                title="View public post (opens in new tab)"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleOpenDelete(post)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards (below lg) */}
            <div className="lg:hidden space-y-3">
              {filteredPosts.map((post) => {
                const imageThumbUrl = post.imageThumb || post.image;
                const pubDateLabel = formatBlogDate(post.publishDate || post.date) || '—';
                const updatedLabel = formatIstDateTime(post.updatedAt || post.createdAt);
                const isPublished = post.status === 'published';
                const viewUrl = `/blog/${post.slug}${isPublished ? '' : '?preview=1'}`;

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {imageThumbUrl ? (
                          <img
                            src={imageThumbUrl}
                            alt={post.imageAlt || post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {post.category || 'General'}
                          </span>
                          {post.featured && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#C9A84C]/15 text-[#9E7D2B] border border-[#C9A84C]/30">
                              <Star className="w-3 h-3 fill-[#C9A84C]" />
                              <span>Featured</span>
                            </span>
                          )}
                          {post.isSample && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                              SAMPLE
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="font-bold text-[#0B1F3A] hover:text-[#C9A84C] text-sm mt-1 line-clamp-2 no-underline"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Draft</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{pubDateLabel}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="p-1.5 text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <a
                          href={viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-[#C9A84C] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(post)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Updated: {updatedLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deletePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Post</h3>
            </div>

            <p className="text-sm text-slate-600">
              Delete <strong className="text-slate-900">"{deletePost.title}"</strong>? This can't be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletePost(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Delete Post</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0B1F3A] text-white text-xs sm:text-sm font-semibold shadow-xl border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
