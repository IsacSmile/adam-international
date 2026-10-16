import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { getEventDateLabel, getEventStatus } from '../../lib/events';

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

export default function AdminEventsListPage({ admin }) {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const adminEmail = admin?.email || outletContext?.admin?.email || '';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'

  // Delete modal state
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [checkingRegistrations, setCheckingRegistrations] = useState(false);
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content?type=events', {
        credentials: 'same-origin',
      });
      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load events');
      }
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      setError(err.message || 'Could not load events');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle open delete dialog
  const handleOpenDelete = async (event) => {
    setDeleteEvent(event);
    setCheckingRegistrations(true);
    setRegistrationsCount(0);
    try {
      const res = await fetch(
        `/api/admin/content?type=event-registrations&slug=${encodeURIComponent(event.slug)}`,
        { credentials: 'same-origin' }
      );
      if (res.ok) {
        const data = await res.json();
        setRegistrationsCount(data.count || 0);
      }
    } catch {
      // Non-fatal if count fetch fails
    } finally {
      setCheckingRegistrations(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteEvent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/content?type=event&id=${encodeURIComponent(deleteEvent.id)}`,
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
        throw new Error(data.error || 'Failed to delete event');
      }
      showToast(`Deleted "${deleteEvent.title}"`);
      setDeleteEvent(null);
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Error deleting event');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Status filter
      if (statusFilter !== 'all' && ev.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = ev.title?.toLowerCase().includes(q);
        const taglineMatch = ev.tagline?.toLowerCase().includes(q);
        const slugMatch = ev.slug?.toLowerCase().includes(q);
        const locationMatch = ev.location?.toLowerCase().includes(q);
        if (!titleMatch && !taglineMatch && !slugMatch && !locationMatch) {
          return false;
        }
      }
      return true;
    });
  }, [events, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    let all = events.length;
    let published = 0;
    let draft = 0;
    for (const ev of events) {
      if (ev.status === 'published') published++;
      else if (ev.status === 'draft') draft++;
    }
    return { all, published, draft };
  }, [events]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F3A] flex flex-col font-sans">
      <Helmet>
        <title>Events Management | Adam International Admin</title>
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
              Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage spot admission events, achievement awards, and registrations.
            </p>
          </div>

          <Link
            to="/admin/events/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-sm font-bold shadow-sm transition-all hover:shadow active:scale-98 no-underline shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C9A84C]" />
            <span>New event</span>
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
                placeholder="Search by title, location or slug…"
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
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
            <p className="text-sm font-semibold text-slate-600">Loading events…</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p className="text-sm font-bold text-rose-800">{error}</p>
            <button
              type="button"
              onClick={fetchEvents}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A]">
                {searchQuery || statusFilter !== 'all' ? 'No matching events found' : 'No events yet.'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try clearing your search or changing the status filter.'
                  : 'Get started by creating your first event.'}
              </p>
            </div>
            <Link
              to="/admin/events/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142e54] text-[#C9A84C] text-xs font-bold transition-all shadow-sm no-underline"
            >
              <Plus className="w-4 h-4 text-[#C9A84C]" />
              <span>New event</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0B1F3A]/5 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 w-16">Poster</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((ev) => {
                      const dateLabel = getEventDateLabel(ev) || '—';
                      const status = getEventStatus(ev);
                      const isUpcoming = status === 'upcoming';
                      const isAward = ev.type === 'award';
                      const isPublished = ev.status === 'published';
                      const previewUrl = `/events/${ev.slug}${!isPublished ? '?preview=1' : ''}`;

                      return (
                        <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Poster Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {ev.posterThumb || ev.poster || ev.photo || ev.imageThumb || ev.image ? (
                                <img
                                  src={ev.posterThumb || ev.poster || ev.photo || ev.imageThumb || ev.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Calendar className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          </td>

                          {/* Title */}
                          <td className="py-3 px-4 max-w-xs">
                            <Link
                              to={`/admin/events/${ev.id}`}
                              className="font-bold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors line-clamp-1 no-underline text-sm"
                            >
                              {ev.title}
                            </Link>
                            {ev.tagline && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                                {ev.tagline}
                              </p>
                            )}
                          </td>

                          {/* Type */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isAward
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {isAward ? 'Award' : 'Spot Admission'}
                            </span>
                          </td>

                          {/* Date Label */}
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                            {dateLabel}
                          </td>

                          {/* Upcoming / Past */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                isUpcoming
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isPublished
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isPublished ? 'bg-emerald-600' : 'bg-slate-400'
                                }`}
                              />
                              {isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>

                          {/* Last Updated */}
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                            {formatIstDateTime(ev.updatedAt || ev.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <Link
                                to={`/admin/events/${ev.id}`}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors"
                                title="Edit event"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>

                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-[#C9A84C] hover:bg-slate-100 transition-colors"
                                title={isPublished ? 'View public event' : 'View draft preview'}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleOpenDelete(ev)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete event"
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

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {filteredEvents.map((ev) => {
                const dateLabel = getEventDateLabel(ev) || '—';
                const status = getEventStatus(ev);
                const isUpcoming = status === 'upcoming';
                const isAward = ev.type === 'award';
                const isPublished = ev.status === 'published';
                const previewUrl = `/events/${ev.slug}${!isPublished ? '?preview=1' : ''}`;

                return (
                  <div
                    key={ev.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {ev.posterThumb || ev.poster || ev.photo || ev.imageThumb || ev.image ? (
                          <img
                            src={ev.posterThumb || ev.poster || ev.photo || ev.imageThumb || ev.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Calendar className="w-6 h-6 text-slate-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isAward
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {isAward ? 'Award' : 'Spot Admission'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <Link
                          to={`/admin/events/${ev.id}`}
                          className="font-bold text-[#0B1F3A] text-sm leading-snug line-clamp-2 no-underline hover:text-[#C9A84C]"
                        >
                          {ev.title}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>{dateLabel}</span>
                      <span className="font-semibold">{isUpcoming ? 'Upcoming' : 'Past'}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>

                      <Link
                        to={`/admin/events/${ev.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B1F3A] text-[#C9A84C] text-xs font-bold hover:bg-[#142e54]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenDelete(ev)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#0B1F3A]">
                Delete "{deleteEvent.title}"?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                This can't be undone. The event will be permanently deleted from the database.
              </p>

              {checkingRegistrations ? (
                <p className="text-xs text-slate-400 italic">Checking event registrations…</p>
              ) : registrationsCount > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                  <p className="text-xs font-bold text-amber-900">
                    {registrationsCount} {registrationsCount === 1 ? 'registration references' : 'registrations reference'} this event.
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    They will stay in Leads, and the event title will display as "{deleteEvent.slug} (deleted)".
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteEvent(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
