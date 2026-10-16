import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  Trash2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Star,
  FileText,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Sparkles,
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import ImageUploader from '../../components/admin/ImageUploader';
import SelectField from '../../components/shared/SelectField';
import { blogCategories } from '../../data/blogCategories';
import { countries } from '../../data/countries';
import { renderMarkdown, formatBlogDate } from '../../lib/blog';

function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function formatIstDateTime(isoStr) {
  if (!isoStr) return '';
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

function getTodayIST() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function AdminBlogEditorPage({ admin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const adminEmail = admin?.email || outletContext?.admin?.email || '';
  const isEditing = Boolean(id);

  // Form states
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [isDirty, setIsDirty] = useState(false);

  // Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [hasManualSlug, setHasManualSlug] = useState(false);
  const [category, setCategory] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Adam International Team');
  const [publishDate, setPublishDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSample, setIsSample] = useState(false);

  // Images
  const [image, setImage] = useState('');
  const [imageThumb, setImageThumb] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Markdown Body
  const [bodyMd, setBodyMd] = useState('');
  const [contentTab, setContentTab] = useState('write'); // 'write' | 'preview'
  const textareaRef = useRef(null);

  // Status & meta
  const [status, setStatus] = useState('draft');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [updatedBy, setUpdatedBy] = useState('');

  // Server error / validation states
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Category select options
  const categoryOptions = useMemo(() => {
    return blogCategories.map((c) => ({
      value: c.slug,
      label: c.name,
    }));
  }, []);

  // Auto-slug from title if not manually edited
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    markDirty();
    if (!hasManualSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e) => {
    const val = e.target.value;
    setHasManualSlug(true);
    setSlug(slugify(val));
    markDirty();
  };

  const handleCountryToggle = (countrySlug) => {
    setSelectedCountries((prev) => {
      if (prev.includes(countrySlug)) {
        markDirty();
        return prev.filter((s) => s !== countrySlug);
      }
      if (prev.length >= 5) {
        return prev;
      }
      markDirty();
      return [...prev, countrySlug];
    });
  };

  // Load existing post if editing
  useEffect(() => {
    if (!isEditing) return;
    let isMounted = true;

    async function loadPost() {
      setLoadingInitial(true);
      setGeneralError(null);
      try {
        const res = await fetch(`/api/admin/content?type=post&id=${encodeURIComponent(id)}`, {
          credentials: 'same-origin',
        });
        if (res.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load post');
        }
        const data = await res.json();
        if (!isMounted) return;

        setTitle(data.title || '');
        setSlug(data.slug || '');
        setHasManualSlug(true);
        setCategory(data.categorySlug || data.category || '');
        setSelectedCountries(Array.isArray(data.countries) ? data.countries : []);
        setSummary(data.summary || '');
        setAuthor(data.author || 'Adam International Team');
        setPublishDate(data.publishDate || data.date || '');
        setFeatured(Boolean(data.featured));
        setIsSample(Boolean(data.isSample ?? data.isPlaceholder));

        setImage(data.image || '');
        setImageThumb(data.imageThumb || '');
        setImageAlt(data.imageAlt || '');

        setBodyMd(data.bodyMd || data.body_md || '');

        setStatus(data.status || 'draft');
        setUpdatedAt(data.updatedAt || data.createdAt);
        setUpdatedBy(data.updatedBy || '');

        setIsDirty(false);
      } catch (err) {
        setGeneralError('Failed to load blog post details.');
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [id, isEditing, navigate]);

  // Unsaved changes warning (beforeunload and in-app navigation)
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleDocumentClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      if (anchor.target === '_blank') return;
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isDirty]);

  // Markdown Toolbar insertion helper
  const insertMarkdown = (prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.slice(start, end) || defaultText;

    let replacement = '';
    if (prefix === '## ' || prefix === '### ' || prefix === '> ') {
      replacement = `${prefix}${selected}`;
    } else if (prefix === '- ') {
      replacement = selected
        .split('\n')
        .map((line) => (line.startsWith('- ') ? line : `- ${line}`))
        .join('\n');
    } else if (prefix === '1. ') {
      replacement = selected
        .split('\n')
        .map((line, idx) => `${idx + 1}. ${line.replace(/^\d+\.\s*/, '')}`)
        .join('\n');
    } else if (prefix === '[' && suffix === '](url)') {
      replacement = `[${selected || 'Link text'}](https://example.com)`;
    } else {
      replacement = `${prefix}${selected}${suffix}`;
    }

    const newText = text.slice(0, start) + replacement + text.slice(end);
    setBodyMd(newText);
    markDirty();

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Build payload
  const buildPayload = (overrideStatus) => {
    const finalStatus = overrideStatus !== undefined ? overrideStatus : status;

    let finalPublishDate = publishDate;
    if (!finalPublishDate && finalStatus === 'published') {
      finalPublishDate = getTodayIST();
    }

    return {
      title: title.trim(),
      slug: slug.trim(),
      category: category.trim(),
      countries: selectedCountries,
      summary: summary.trim(),
      body_md: bodyMd,
      image: image || null,
      image_thumb: imageThumb || null,
      image_alt: imageAlt.trim() || null,
      author: author.trim() || 'Adam International Team',
      featured: Boolean(featured),
      is_sample: Boolean(isSample),
      status: finalStatus,
      publish_date: finalPublishDate || null,
    };
  };

  // Save handler
  const handleSave = async (targetStatus, isPreview = false) => {
    setSaving(true);
    setFieldErrors({});
    setGeneralError(null);

    const payload = buildPayload(targetStatus);

    try {
      const url = isEditing
        ? `/api/admin/content?type=post&id=${encodeURIComponent(id)}`
        : '/api/admin/content?type=post';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return false;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          setFieldErrors({ slug: 'This slug is already used. Choose another.' });
          setGeneralError('This slug is already used. Choose another.');
        } else if (data.fields) {
          setFieldErrors(data.fields);
          setGeneralError('Please correct the highlighted errors before saving.');
        } else {
          setGeneralError(data.error || 'Failed to save post');
        }
        return false;
      }

      // Success
      setIsDirty(false);
      setStatus(payload.status);
      if (payload.publish_date) {
        setPublishDate(payload.publish_date);
      }

      const savedItem = data.post || data;
      if (savedItem.updatedAt || savedItem.updated_at) {
        setUpdatedAt(savedItem.updatedAt || savedItem.updated_at);
      }
      if (savedItem.updatedBy || savedItem.updated_by) {
        setUpdatedBy(savedItem.updatedBy || savedItem.updated_by);
      }

      if (payload.status === 'published') {
        showToast('Post published');
      } else {
        showToast('Draft saved');
      }

      // Redirect if newly created
      if (!isEditing && savedItem.id) {
        navigate(`/admin/blog/${savedItem.id}`, { replace: true });
      }

      if (isPreview) {
        const previewUrl = `/blog/${payload.slug}?preview=1`;
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
      }

      return true;
    } catch (err) {
      setGeneralError('Network error while saving. Please retry.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!isEditing) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/content?type=post&id=${encodeURIComponent(id)}`,
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
        throw new Error(data.error || 'Failed to delete post');
      }
      showToast(`Deleted "${title}"`);
      navigate('/admin/blog', { replace: true });
    } catch (err) {
      alert(err.message || 'Error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    navigate('/admin/blog');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <AdminHeader adminEmail={adminEmail} />
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-12 text-center">
          <RefreshCw className="w-8 h-8 text-[#C9A84C] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading blog post editor…</p>
        </div>
      </div>
    );
  }

  const isPublished = status === 'published';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F3A] flex flex-col font-sans pb-28">
      <Helmet>
        <title>
          {isEditing ? `Edit ${title || 'Post'}` : 'New Blog Post'} | Adam International Admin
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Shared Admin Header */}
      <AdminHeader adminEmail={adminEmail} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top bar with Back button and Status / Last Updated */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Back to blog posts"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                  {isEditing ? 'Edit Post' : 'New Blog Post'}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                {isSample && (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      SAMPLE POST
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSample(false);
                        markDirty();
                        showToast('Marked as real post');
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0B1F3A] text-[#C9A84C] hover:bg-[#142e54] transition-colors cursor-pointer"
                    >
                      Mark as real post
                    </button>
                  </div>
                )}
              </div>
              {isEditing && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Last updated {formatIstDateTime(updatedAt)}
                  {updatedBy ? ` by ${updatedBy}` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {slug && (
              <button
                type="button"
                onClick={() => handleSave(status, true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Preview</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold flex-1">{generalError}</div>
          </div>
        )}

        {/* Section 1: Post Basics */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-[#0B1F3A] tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C9A84C]" />
            <span>Post Details</span>
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Complete Guide to Studying in Spain: Universities, Visas & Costs"
              maxLength={160}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                fieldErrors.title
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
              }`}
            />
            {fieldErrors.title ? (
              <p className="text-xs text-rose-600 font-medium mt-1">{fieldErrors.title}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">3–160 characters</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Slug *
            </label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="complete-guide-study-spain"
                maxLength={120}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                  fieldErrors.slug
                    ? 'border-rose-300 ring-2 ring-rose-100'
                    : 'border-slate-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
                }`}
              />
            </div>
            {fieldErrors.slug ? (
              <p className="text-xs text-rose-600 font-medium mt-1">{fieldErrors.slug}</p>
            ) : (
              <div className="text-[11px] text-slate-400 mt-1 flex flex-col gap-0.5">
                <span>Public URL: <code className="text-[#0B1F3A] font-semibold">/blog/{slug || '{slug}'}</code></span>
                {isPublished && (
                  <span className="text-amber-700 font-medium">
                    ⚠️ Changing the slug will break existing links to this post.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SelectField
                name="category"
                label="Category *"
                value={category}
                onChange={(e) => {
                  const val = e && typeof e === 'object' && 'target' in e ? e.target.value : e;
                  setCategory(val);
                  markDirty();
                }}
                options={categoryOptions}
                searchable={false}
                placeholder="Select category…"
                error={fieldErrors.category}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  markDirty();
                }}
                placeholder="Adam International Team"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default: Adam International Team</p>
            </div>
          </div>

          {/* Publish Date & Featured Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => {
                  setPublishDate(e.target.value);
                  markDirty();
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Defaults to today (IST) when published.
              </p>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Featured Status
              </label>
              <label className="relative flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    markDirty();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#0B1F3A]">
                  <Star className={`w-4 h-4 ${featured ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-slate-400'}`} />
                  <span>Featured Post</span>
                </div>
              </label>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Only one post can be featured; this replaces the current one.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Summary *
              </label>
              <span
                className={`text-[11px] font-mono font-bold ${
                  summary.length > 220 ? 'text-rose-600' : 'text-slate-400'
                }`}
              >
                {summary.length} / 220
              </span>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                markDirty();
              }}
              placeholder="A brief overview of the post. Shown as 2 lines on blog cards."
              maxLength={220}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                fieldErrors.summary
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
              }`}
            />
            {fieldErrors.summary ? (
              <p className="text-xs text-rose-600 font-medium mt-1">{fieldErrors.summary}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Shown as 2 lines on blog cards.
              </p>
            )}
          </div>

          {/* Related Countries (Multi-select chips, max 5) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related countries
              </label>
              <span
                className={`text-[11px] font-mono font-bold ${
                  selectedCountries.length >= 5 ? 'text-[#C9A84C]' : 'text-slate-400'
                }`}
              >
                {selectedCountries.length} / 5 selected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Used to suggest this post on university and country pages.
            </p>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => {
                const isSelected = selectedCountries.includes(c.slug);
                const isLimitReached = !isSelected && selectedCountries.length >= 5;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleCountryToggle(c.slug)}
                    disabled={isLimitReached}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1F3A] text-white shadow-xs border border-[#0B1F3A]'
                        : isLimitReached
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span role="img" aria-label={c.name} className="text-sm leading-none">
                      {c.flag}
                    </span>
                    <span>{c.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#C9A84C]" />}
                  </button>
                );
              })}
            </div>
            {fieldErrors.countries && (
              <p className="text-xs text-rose-600 font-medium mt-2">{fieldErrors.countries}</p>
            )}
          </div>
        </div>

        {/* Section 2: Featured Image */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-[#0B1F3A] tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span>Featured Image</span>
          </h2>

          <div>
            <ImageUploader
              label="Featured Image *"
              value={image}
              thumbValue={imageThumb}
              pathname={`blog/${slug || 'post'}.jpg`}
              onChange={({ url, thumbUrl }) => {
                setImage(url);
                setImageThumb(thumbUrl);
                markDirty();
              }}
              onRemove={() => {
                setImage('');
                setImageThumb('');
                markDirty();
              }}
              helpText="Required to publish. 16:9 aspect ratio recommended. Automatically resized to max 1600px with optimized thumbnail."
            />
            {fieldErrors.image && (
              <p className="text-xs text-rose-600 font-medium mt-2">{fieldErrors.image}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Image Alt Text *
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => {
                setImageAlt(e.target.value);
                markDirty();
              }}
              placeholder="e.g. University students walking across European campus grounds"
              maxLength={200}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                fieldErrors.image_alt
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
              }`}
            />
            {fieldErrors.image_alt ? (
              <p className="text-xs text-rose-600 font-medium mt-1">{fieldErrors.image_alt}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Required when an image is set. Used for screen readers and SEO.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Article Content (Markdown) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#0B1F3A] tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A84C]" />
              <span>Article Content (Markdown)</span>
            </h2>

            {/* Write / Preview Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setContentTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'write'
                    ? 'bg-white text-[#0B1F3A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setContentTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'preview'
                    ? 'bg-white text-[#0B1F3A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {contentTab === 'write' ? (
            <div className="space-y-2">
              {/* Markdown Toolbar */}
              <div className="flex items-center gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-xl flex-wrap">
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ', '', 'Heading 2')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Heading 2 (##)"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ', '', 'Heading 3')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Heading 3 (###)"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**', 'bold text')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*', 'italic text')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('[', '](url)', 'link text')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Link ([text](url))"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ', '', 'List item')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Bulleted List (- item)"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('1. ', '', 'Numbered item')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Numbered List (1. item)"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ', '', 'Quote text')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Blockquote (> quote)"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={18}
                value={bodyMd}
                onChange={(e) => {
                  setBodyMd(e.target.value);
                  markDirty();
                }}
                placeholder="Write your article in Markdown. Use headings, bullet lists, bold text, links, and blockquotes…"
                maxLength={50000}
                className={`w-full p-4 rounded-xl border text-sm font-mono leading-relaxed transition-all resize-y ${
                  fieldErrors.body_md
                    ? 'border-rose-300 ring-2 ring-rose-100'
                    : 'border-slate-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
                }`}
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Supports GitHub Flavored Markdown (H2, H3, bold, lists, quotes, links).</span>
                <span className="font-mono">{bodyMd.length} / 50,000 chars</span>
              </div>
              {fieldErrors.body_md && (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.body_md}</p>
              )}
            </div>
          ) : (
            /* Preview Tab */
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white min-h-[400px]">
              {bodyMd.trim() ? (
                <div
                  className="blog-prose"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(bodyMd) }}
                />
              ) : (
                <p className="text-sm text-slate-400 italic text-center py-12">
                  No article content yet. Switch to the Write tab to add markdown.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Delete button (only when editing existing item) */}
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            {/* Unpublish button (when currently published) */}
            {isPublished && (
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>Unpublish</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Save Draft Button (hidden when published) */}
            {!isPublished && (
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-slate-400" />
                <span>Save draft</span>
              </button>
            )}

            {/* Preview Button */}
            <button
              type="button"
              onClick={() => handleSave(status, true)}
              disabled={saving}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Eye className="w-4 h-4 text-[#C9A84C]" />
              <span>Preview</span>
            </button>

            {/* Publish / Update Button */}
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A84C]" />
              ) : (
                <Check className="w-4 h-4 text-[#C9A84C]" />
              )}
              <span>{isPublished ? 'Update post' : 'Publish post'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Delete "{title}"?</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                This can't be undone. The post will be permanently removed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Delete post</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
