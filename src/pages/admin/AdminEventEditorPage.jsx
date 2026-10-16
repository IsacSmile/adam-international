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
  Plus,
  ArrowUp,
  ArrowDown,
  X,
  RefreshCw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Info,
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import ImageUploader from '../../components/admin/ImageUploader';
import SelectField from '../../components/shared/SelectField';
import FormattedText from '../../components/shared/FormattedText';
import { countries } from '../../data/countries';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

const MONTH_OPTIONS = [
  { value: '01', label: '01 - January' },
  { value: '02', label: '02 - February' },
  { value: '03', label: '03 - March' },
  { value: '04', label: '04 - April' },
  { value: '05', label: '05 - May' },
  { value: '06', label: '06 - June' },
  { value: '07', label: '07 - July' },
  { value: '08', label: '08 - August' },
  { value: '09', label: '09 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' },
];

const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => {
  const y = String(2024 + i);
  return { value: y, label: y };
});

export default function AdminEventEditorPage({ admin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const adminEmail = admin?.email || outletContext?.admin?.email || '';
  const isEditing = Boolean(id);

  // Form states
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [initialData, setInitialData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Fields
  const [type, setType] = useState('spot-admission'); // 'spot-admission' | 'award'
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [hasManualSlug, setHasManualSlug] = useState(false);
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');

  // Date selection mode
  const [dateMode, setDateMode] = useState('not-set'); // 'exact' | 'month' | 'year' | 'not-set'
  const [exactDate, setExactDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedMonthYear, setSelectedMonthYear] = useState('2026');
  const [selectedYearOnly, setSelectedYearOnly] = useState('2026');

  // Location & Org
  const [location, setLocation] = useState('');
  const [organisedBy, setOrganisedBy] = useState('Adam International');
  const [country, setCountry] = useState('');

  // Highlight & Registration
  const [highlight, setHighlight] = useState('');
  const [conditionNote, setConditionNote] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Content
  const [bodyText, setBodyText] = useState('');
  const [contentTab, setContentTab] = useState('write'); // 'write' | 'preview'
  const [closingLine, setClosingLine] = useState('');
  const [closingItalic, setClosingItalic] = useState(false);

  // Facts
  const [facts, setFacts] = useState([]);

  // Images
  const [poster, setPoster] = useState('');
  const [posterThumb, setPosterThumb] = useState('');
  const [posterWidth, setPosterWidth] = useState(null);
  const [posterHeight, setPosterHeight] = useState(null);

  const [image, setImage] = useState('');
  const [imageThumb, setImageThumb] = useState('');

  const [photo, setPhoto] = useState('');
  const [awardingBody, setAwardingBody] = useState('');

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
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [checkingRegistrations, setCheckingRegistrations] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mark form as dirty on user change
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Auto-slug from title
  const handleTitleChange = (val) => {
    setTitle(val);
    markDirty();
    if (!hasManualSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val) => {
    setHasManualSlug(true);
    setSlug(slugify(val));
    markDirty();
  };

  // Pre-fill condition note when highlight is typed
  const handleHighlightChange = (val) => {
    setHighlight(val);
    markDirty();
    if (val.trim() && !conditionNote.trim()) {
      setConditionNote('Subject to eligibility and university approval.');
    }
  };

  // Country select options
  const countryOptions = useMemo(() => {
    const list = countries.map((c) => ({
      value: c.slug,
      label: `${c.flag ? c.flag + ' ' : ''}${c.name}`,
    }));
    return [{ value: '', label: 'None (Global / No country)' }, ...list];
  }, []);

  // Fetch initial event when editing
  useEffect(() => {
    if (!isEditing) return;
    let isMounted = true;

    async function loadEvent() {
      setLoadingInitial(true);
      try {
        const res = await fetch(`/api/admin/content?type=event&id=${encodeURIComponent(id)}`, {
          credentials: 'same-origin',
        });
        if (!isMounted) return;
        if (res.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        if (res.status === 404) {
          navigate('/admin/events', { replace: true });
          return;
        }
        const data = await res.json();
        setInitialData(data);

        // Populate fields
        setType(data.type || 'spot-admission');
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setHasManualSlug(true);
        setTagline(data.tagline || '');
        setSummary(data.summary || '');

        // Date mode
        if (data.date) {
          setDateMode('exact');
          setExactDate(String(data.date).slice(0, 10));
        } else if (data.month) {
          setDateMode('month');
          const [y, m] = String(data.month).split('-');
          if (y && m) {
            setSelectedMonthYear(y);
            setSelectedMonth(m);
          }
        } else if (data.year) {
          setDateMode('year');
          setSelectedYearOnly(String(data.year));
        } else {
          setDateMode('not-set');
        }

        setLocation(data.location || '');
        setOrganisedBy(data.organisedBy || 'Adam International');
        setCountry(data.country || '');

        setHighlight(data.highlight || '');
        setConditionNote(data.conditionNote || '');
        const regVal = data.registrationOpen !== undefined ? data.registrationOpen : data.registration_open;
        setRegistrationOpen(regVal === true || regVal === 'true' || regVal === 'on' || regVal === 1 || regVal === '1');

        // Body
        if (typeof data.bodyRaw === 'string') {
          setBodyText(data.bodyRaw);
        } else if (Array.isArray(data.body)) {
          setBodyText(data.body.join('\n\n'));
        } else {
          setBodyText(String(data.body || ''));
        }

        setClosingLine(data.closingLine || '');
        setClosingItalic(Boolean(data.closingItalic));
        setFacts(Array.isArray(data.facts) ? data.facts : []);

        setPoster(data.poster || '');
        setPosterThumb(data.posterThumb || '');
        setPosterWidth(data.posterWidth || null);
        setPosterHeight(data.posterHeight || null);

        setImage(data.image || '');
        setImageThumb(data.imageThumb || '');
        setPhoto(data.photo || '');
        setAwardingBody(data.awardingBody || '');

        setStatus(data.status || 'draft');
        setUpdatedAt(data.updatedAt || data.createdAt);
        setUpdatedBy(data.updatedBy || '');

        setIsDirty(false);
      } catch (err) {
        setGeneralError('Failed to load event details.');
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    loadEvent();
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

  // Facts handlers
  const handleAddFact = () => {
    if (facts.length >= 12) return;
    setFacts([...facts, { label: '', value: '' }]);
    markDirty();
  };

  const handleUpdateFact = (idx, field, val) => {
    const next = [...facts];
    next[idx] = { ...next[idx], [field]: val };
    setFacts(next);
    markDirty();
  };

  const handleRemoveFact = (idx) => {
    setFacts(facts.filter((_, i) => i !== idx));
    markDirty();
  };

  const handleMoveFact = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= facts.length) return;
    const next = [...facts];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setFacts(next);
    markDirty();
  };

  // Build payload
  const buildPayload = (overrideStatus) => {
    const finalStatus = overrideStatus !== undefined ? overrideStatus : status;

    // Date computation
    let finalDate = null;
    let finalMonth = null;
    let finalYear = null;

    if (dateMode === 'exact' && exactDate) {
      finalDate = exactDate;
      finalMonth = null;
      finalYear = null;
    } else if (dateMode === 'month') {
      finalMonth = `${selectedMonthYear}-${selectedMonth}`;
      finalDate = null;
      finalYear = null;
    } else if (dateMode === 'year') {
      finalYear = selectedYearOnly;
      finalDate = null;
      finalMonth = null;
    } else {
      finalDate = null;
      finalMonth = null;
      finalYear = null;
    }

    return {
      type,
      title: title.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || null,
      summary: summary.trim(),
      status: finalStatus,
      date: finalDate,
      month: finalMonth,
      year: finalYear,
      location: location.trim() || null,
      organised_by: organisedBy.trim() || null,
      country: country || null,
      highlight: type === 'spot-admission' ? highlight.trim() || null : null,
      condition_note: type === 'spot-admission' ? conditionNote.trim() || null : null,
      registration_open: type === 'spot-admission' ? Boolean(registrationOpen) : false,
      body: bodyText,
      closing_line: closingLine.trim() || null,
      closing_italic: Boolean(closingItalic),
      facts: facts.filter((f) => f.label.trim() || f.value.trim()),
      poster: poster || null,
      poster_thumb: posterThumb || null,
      poster_width: posterWidth || null,
      poster_height: posterHeight || null,
      image: image || null,
      image_thumb: imageThumb || null,
      photo: type === 'award' ? photo || null : null,
      awarding_body: type === 'award' ? awardingBody.trim() || null : null,
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
        ? `/api/admin/content?type=event&id=${encodeURIComponent(id)}`
        : '/api/admin/content?type=event';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
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
          setGeneralError(data.error || 'Failed to save event');
        }
        return false;
      }

      // Success
      setIsDirty(false);
      setStatus(payload.status);

      const savedItem = data.event || data;
      if (savedItem.updatedAt || savedItem.updated_at) {
        setUpdatedAt(savedItem.updatedAt || savedItem.updated_at);
      }
      if (savedItem.updatedBy || savedItem.updated_by) {
        setUpdatedBy(savedItem.updatedBy || savedItem.updated_by);
      }

      if (payload.status === 'published') {
        showToast('Event published');
      } else {
        showToast('Draft saved');
      }

      // Redirect if newly created
      if (!isEditing && savedItem.id) {
        navigate(`/admin/events/${savedItem.id}`, { replace: true });
      }

      if (isPreview) {
        const previewUrl = `/events/${payload.slug}?preview=1`;
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

  // Open delete dialog
  const handleOpenDelete = async () => {
    setShowDeleteModal(true);
    setCheckingRegistrations(true);
    setRegistrationsCount(0);
    try {
      const res = await fetch(
        `/api/admin/content?type=event-registrations&slug=${encodeURIComponent(slug)}`,
        { credentials: 'same-origin' }
      );
      if (res.ok) {
        const data = await res.json();
        setRegistrationsCount(data.count || 0);
      }
    } catch {
    } finally {
      setCheckingRegistrations(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/content?type=event&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete event');
      }
      navigate('/admin/events', { replace: true });
    } catch (err) {
      alert(err.message || 'Error deleting event');
      setIsDeleting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <AdminHeader adminEmail={adminEmail} />
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-12 text-center">
          <RefreshCw className="w-8 h-8 text-[#C9A84C] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading event editor…</p>
        </div>
      </div>
    );
  }

  const isPublished = status === 'published';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F3A] flex flex-col font-sans pb-28">
      <Helmet>
        <title>
          {isEditing ? `Edit ${title || 'Event'}` : 'New Event'} | Adam International Admin
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Admin Header */}
      <AdminHeader adminEmail={adminEmail} />

      {/* Editor Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top bar with Back button and Status / Last Updated */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/events"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Back to events list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                  {isEditing ? 'Edit Event' : 'New Event'}
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
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold flex-1">
              {generalError}
            </div>
            <button
              type="button"
              onClick={() => setGeneralError(null)}
              className="text-rose-400 hover:text-rose-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            SECTION 1: BASICS
        ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">Basics</h2>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Event Type *
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  type === 'spot-admission'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 font-bold text-[#0B1F3A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="eventType"
                  value="spot-admission"
                  checked={type === 'spot-admission'}
                  onChange={() => {
                    setType('spot-admission');
                    markDirty();
                  }}
                  className="text-[#0B1F3A] focus:ring-[#C9A84C]"
                />
                <span className="text-xs sm:text-sm">Spot Admission</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  type === 'award'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 font-bold text-[#0B1F3A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="eventType"
                  value="award"
                  checked={type === 'award'}
                  onChange={() => {
                    setType('award');
                    markDirty();
                  }}
                  className="text-[#0B1F3A] focus:ring-[#C9A84C]"
                />
                <span className="text-xs sm:text-sm">Achievement / Award</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Hungary Spot Admission – October 2026"
              maxLength={160}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                fieldErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">/events/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="hungary-spot-admission-october-2026"
                maxLength={120}
                className={`flex-1 px-3.5 py-2 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                  fieldErrors.slug ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
            </div>
            {isPublished && (
              <p className="text-[11px] font-semibold text-amber-700 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Changing the slug will break existing links to this event.</span>
              </p>
            )}
            {fieldErrors.slug && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.slug}</p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tagline (Optional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => {
                setTagline(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Get Your Offer Letter on the Spot!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all"
            />
          </div>

          {/* Summary with Counter (300) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Summary *
              </label>
              <span
                className={`text-[11px] font-bold ${
                  summary.length > 300 ? 'text-rose-600' : 'text-slate-400'
                }`}
              >
                {summary.length} / 300
              </span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                markDirty();
              }}
              placeholder="Brief summary displayed on cards and search snippets (max 300 characters)…"
              maxLength={300}
              rows={3}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                fieldErrors.summary ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {fieldErrors.summary && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.summary}</p>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: WHEN & WHERE
        ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">When & Where</h2>
          </div>

          {/* Date Mode Radio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Date Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'exact', label: 'Exact Date' },
                { id: 'month', label: 'Month Only' },
                { id: 'year', label: 'Year Only' },
                { id: 'not-set', label: 'Not Set / TBA' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                    dateMode === m.id
                      ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 text-[#0B1F3A] font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="dateMode"
                    value={m.id}
                    checked={dateMode === m.id}
                    onChange={() => {
                      setDateMode(m.id);
                      markDirty();
                    }}
                    className="text-[#0B1F3A] focus:ring-[#C9A84C]"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional Date Inputs */}
          {dateMode === 'exact' && (
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Exact Event Date (YYYY-MM-DD) *
              </label>
              <input
                type="date"
                value={exactDate}
                onChange={(e) => {
                  setExactDate(e.target.value);
                  markDirty();
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                  fieldErrors.date ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {fieldErrors.date && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.date}</p>
              )}
            </div>
          )}

          {dateMode === 'month' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all bg-white"
                >
                  {MONTH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <select
                  value={selectedMonthYear}
                  onChange={(e) => {
                    setSelectedMonthYear(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all bg-white"
                >
                  {YEAR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {dateMode === 'year' && (
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Year
              </label>
              <select
                value={selectedYearOnly}
                onChange={(e) => {
                  setSelectedYearOnly(e.target.value);
                  markDirty();
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all bg-white"
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location & Organised By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Kochi, Kerala"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Organised By
              </label>
              <input
                type="text"
                value={organisedBy}
                onChange={(e) => {
                  setOrganisedBy(e.target.value);
                  markDirty();
                }}
                placeholder="Adam International"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="max-w-md">
            <SelectField
              name="country"
              label="Country"
              value={country}
              onChange={(e) => {
                const val = e && typeof e === 'object' && 'target' in e ? e.target.value : e;
                setCountry(val);
                markDirty();
              }}
              options={countryOptions}
              searchable={true}
              placeholder="Select country…"
              error={fieldErrors.country}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used for country flag, banner fallback image, and country page integration.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: HIGHLIGHT & REGISTRATION (Spot Admission Only)
        ========================================================================= */}
        {type === 'spot-admission' && (
          <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Highlight & Registrations
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Highlight Pill (Optional)
              </label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleHighlightChange(e.target.value)}
                placeholder="e.g. Get your offer letter on the spot"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Condition Note {highlight.trim() ? '*' : '(Optional)'}
              </label>
              <input
                type="text"
                value={conditionNote}
                onChange={(e) => {
                  setConditionNote(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Subject to eligibility and university approval."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                  fieldErrors.condition_note ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Required when highlight is set to satisfy compliance rules.
              </p>
              {fieldErrors.condition_note && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  {fieldErrors.condition_note}
                </p>
              )}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationOpen}
                  onChange={(e) => {
                    setRegistrationOpen(e.target.checked);
                    markDirty();
                  }}
                  className="w-4 h-4 rounded text-[#0B1F3A] focus:ring-[#C9A84C] border-slate-300"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                    Registration Open
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Allows prospective students to submit registration enquiries for this event.
                  </p>
                </div>
              </label>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 4: CONTENT & BODY
        ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">Content & Body</h2>
            </div>

            {/* Write / Preview Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setContentTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'write' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setContentTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentTab === 'preview' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Body Textarea / Preview */}
          {contentTab === 'write' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Body Paragraphs
                </label>
                <span className="text-[11px] text-slate-400">
                  Leave a blank line between paragraphs. Use **double asterisks** for bold.
                </span>
              </div>
              <textarea
                value={bodyText}
                onChange={(e) => {
                  setBodyText(e.target.value);
                  markDirty();
                }}
                rows={8}
                placeholder="Write your event overview paragraphs here…"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all font-sans"
              />
            </div>
          ) : (
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-slate-200 space-y-4">
              {bodyText.trim() ? (
                bodyText
                  .split(/\r?\n\s*\r?\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      <FormattedText text={para} />
                    </p>
                  ))
              ) : (
                <p className="text-xs text-slate-400 italic">No body paragraphs entered yet.</p>
              )}
            </div>
          )}

          {/* Closing Line */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Closing Line (Optional)
            </label>
            <input
              type="text"
              value={closingLine}
              onChange={(e) => {
                setClosingLine(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Join Adam International and take your first step towards studying in Europe!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all"
            />

            <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={closingItalic}
                onChange={(e) => {
                  setClosingItalic(e.target.checked);
                  markDirty();
                }}
                className="w-4 h-4 rounded text-[#0B1F3A] focus:ring-[#C9A84C] border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">Display closing line in italics</span>
            </label>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: EVENT DETAILS (FACTS)
        ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                Event Details / Key Facts ({facts.length}/12)
              </h2>
            </div>

            <button
              type="button"
              onClick={handleAddFact}
              disabled={facts.length >= 12}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add row</span>
            </button>
          </div>

          {facts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No detail rows added yet. Click "Add row" to show structured facts in the sidebar.
            </p>
          ) : (
            <div className="space-y-2.5">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fact.label}
                    onChange={(e) => handleUpdateFact(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Month)"
                    className="w-1/3 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                  <input
                    type="text"
                    value={fact.value}
                    onChange={(e) => handleUpdateFact(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. October 2026)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                  <button
                    type="button"
                    onClick={() => handleMoveFact(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveFact(idx, 1)}
                    disabled={idx === facts.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFact(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 6: IMAGES
        ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center font-bold text-xs">
              6
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">Images & Poster</h2>
          </div>

          {/* Poster Uploader */}
          <ImageUploader
            label="Event Poster"
            value={poster}
            thumbValue={posterThumb}
            width={posterWidth}
            height={posterHeight}
            pathname={`events/${slug || 'event'}-poster.jpg`}
            onChange={({ url, thumbUrl, width, height }) => {
              setPoster(url);
              setPosterThumb(thumbUrl || '');
              setPosterWidth(width || null);
              setPosterHeight(height || null);
              markDirty();
            }}
            onRemove={() => {
              setPoster('');
              setPosterThumb('');
              setPosterWidth(null);
              setPosterHeight(null);
              markDirty();
            }}
            helpText="Shows dimensions automatically; resized to max 1600px."
          />

          {/* Optional Banner Background */}
          <div className="pt-4 border-t border-slate-100">
            <ImageUploader
              label="Banner Background (Optional)"
              value={image}
              thumbValue={imageThumb}
              pathname={`events/${slug || 'event'}-banner.jpg`}
              onChange={({ url, thumbUrl }) => {
                setImage(url);
                setImageThumb(thumbUrl || '');
                markDirty();
              }}
              onRemove={() => {
                setImage('');
                setImageThumb('');
                markDirty();
              }}
              helpText="Optional; falls back to the selected country image when empty."
            />
          </div>

          {/* Award Photo & Awarding Body (Award Only) */}
          {type === 'award' && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-[#0B1F3A]">Award Specific Details</h3>

              <ImageUploader
                label="Award Photo"
                value={photo}
                pathname={`events/${slug || 'award'}-photo.jpg`}
                onChange={({ url }) => {
                  setPhoto(url);
                  markDirty();
                }}
                onRemove={() => {
                  setPhoto('');
                  markDirty();
                }}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Awarding Body
                </label>
                <input
                  type="text"
                  value={awardingBody}
                  onChange={(e) => {
                    setAwardingBody(e.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. Consumer Protection Council of India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* =========================================================================
          STICKY FOOTER BAR
      ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleOpenDelete}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            {/* Unpublish button (when published) */}
            {isPublished && (
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Unpublish</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Save Draft (hidden when published) */}
            {!isPublished && (
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save draft</span>
              </button>
            )}

            {/* Preview Button */}
            {slug && (
              <button
                type="button"
                onClick={() => handleSave(status, true)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Preview</span>
              </button>
            )}

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
              <span>{isPublished ? 'Update event' : 'Publish event'}</span>
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
                This can't be undone. The event will be permanently removed.
              </p>

              {checkingRegistrations ? (
                <p className="text-xs text-slate-400 italic">Checking event registrations…</p>
              ) : registrationsCount > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                  <p className="text-xs font-bold text-amber-900">
                    {registrationsCount} {registrationsCount === 1 ? 'registration references' : 'registrations reference'} this event.
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    They will stay in Leads, and the event title will display as "{slug} (deleted)".
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Delete event</span>
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
