import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LogOut,
  Search,
  Download,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  ExternalLink,
  Calendar,
  Building2,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  User,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

import { countries } from '../../data/countries';
import { services } from '../../data/services';
import { branches } from '../../data/branches';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'follow_up', label: 'Follow Up', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'not_interested', label: 'Not Interested', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

function formatIST(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatSourcePage(path) {
  if (!path) return null;
  const trimmed = path.trim();
  if (trimmed === '/' || trimmed === '') return 'From: Homepage';
  return `From: ${trimmed}`;
}

export default function AdminDashboardPage({ admin }) {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Current admin email
  const [adminEmail, setAdminEmail] = useState(
    admin?.email || outletContext?.admin?.email || ''
  );

  // Filter states derived from URL search params
  const searchQueryParam = searchParams.get('q') || '';
  const statusParam = searchParams.get('status') || 'all';
  const countryParam = searchParams.get('country') || 'all';
  const serviceParam = searchParams.get('service') || 'all';
  const branchParam = searchParams.get('branch') || 'all';
  const rangeParam = searchParams.get('range') || 'all';
  const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = useState(searchQueryParam);

  // Data states
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [pageSize] = useState(25);
  const [counts, setCounts] = useState({
    all: 0,
    new: 0,
    contacted: 0,
    follow_up: 0,
    converted: 0,
    not_interested: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Selected lead for Row Drawer
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerAssignedTo, setDrawerAssignedTo] = useState('');
  const [drawerStatus, setDrawerStatus] = useState('new');
  const [isSavingDrawer, setIsSavingDrawer] = useState(false);
  const [drawerSavedToast, setDrawerSavedToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keep track of active requests
  const abortControllerRef = useRef(null);

  // Sync admin email from prop, context, or fetch me endpoint
  useEffect(() => {
    if (admin?.email) {
      setAdminEmail(admin.email);
    } else if (outletContext?.admin?.email) {
      setAdminEmail(outletContext.admin.email);
    } else {
      fetch('/api/admin/auth?action=me', { credentials: 'same-origin' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.email) setAdminEmail(data.email);
        })
        .catch(() => {});
    }
  }, [admin, outletContext]);

  // Debounce search input to URL query param
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQueryParam) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('q', searchInput.trim());
          } else {
            next.delete('q');
          }
          next.set('page', '1');
          return next;
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchQueryParam, setSearchParams]);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(searchQueryParam);
  }, [searchQueryParam]);

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (searchQueryParam) query.set('q', searchQueryParam);
    if (statusParam !== 'all') query.set('status', statusParam);
    if (countryParam !== 'all') query.set('country', countryParam);
    if (serviceParam !== 'all') query.set('service', serviceParam);
    if (branchParam !== 'all') query.set('branch', branchParam);
    if (rangeParam !== 'all') query.set('range', rangeParam);
    query.set('page', String(pageParam));

    try {
      const res = await fetch(`/api/admin/leads?${query.toString()}`, {
        credentials: 'same-origin',
        signal: controller.signal,
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load leads');
      }

      const data = await res.json();
      setLeads(data.leads || []);
      setTotalLeads(data.total || 0);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to fetch leads. Please check your connection and retry.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQueryParam,
    statusParam,
    countryParam,
    serviceParam,
    branchParam,
    rangeParam,
    pageParam,
    navigate,
  ]);

  useEffect(() => {
    fetchLeads();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchLeads]);

  // Update a single filter in URL
  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.set('page', '1');
      return next;
    });
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth?action=logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (err) {
      // Proceed to login regardless
    }
    navigate('/admin/login', { replace: true });
  };

  // Export CSV handler
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const query = new URLSearchParams();
      query.set('export', 'csv');
      if (searchQueryParam) query.set('q', searchQueryParam);
      if (statusParam !== 'all') query.set('status', statusParam);
      if (countryParam !== 'all') query.set('country', countryParam);
      if (serviceParam !== 'all') query.set('service', serviceParam);
      if (branchParam !== 'all') query.set('branch', branchParam);
      if (rangeParam !== 'all') query.set('range', rangeParam);

      const res = await fetch(`/api/admin/leads?${query.toString()}`, {
        credentials: 'same-origin',
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error('CSV export failed');
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;

      // Extract filename from response header or default
      let filename = 'adam-leads.csv';
      const disposition = res.headers.get('content-disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to download CSV export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Optimistic status update in table
  const handleStatusChange = async (leadId, newStatus, e) => {
    if (e) e.stopPropagation();
    const prevLead = leads.find((l) => l.id === leadId);
    const prevStatus = prevLead?.status;

    // Apply optimistic update to local list
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      setDrawerStatus(newStatus);
    }

    try {
      const res = await fetch(`/api/admin/leads?id=${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      if (data.lead) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? data.lead : l))
        );
      }
      fetchLeads();
    } catch (err) {
      // Rollback on error
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: prevStatus } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: prevStatus }));
        setDrawerStatus(prevStatus);
      }
      alert('Could not update lead status. Changes rolled back.');
    }
  };

  // Open drawer for a lead
  const openDrawer = (lead) => {
    setSelectedLead(lead);
    setDrawerNotes(lead.notes || '');
    setDrawerAssignedTo(lead.assigned_to || '');
    setDrawerStatus(lead.status || 'new');
    setDrawerSavedToast(false);
  };

  // Save drawer edits
  const handleSaveDrawer = async () => {
    if (!selectedLead) return;
    setIsSavingDrawer(true);

    try {
      const res = await fetch(`/api/admin/leads?id=${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          status: drawerStatus,
          notes: drawerNotes.trim() || null,
          assigned_to: drawerAssignedTo.trim() || null,
        }),
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to save changes');
      }

      const data = await res.json();
      if (data.lead) {
        setSelectedLead(data.lead);
        setLeads((prev) =>
          prev.map((l) => (l.id === data.lead.id ? data.lead : l))
        );
      }
      setDrawerSavedToast(true);
      setTimeout(() => setDrawerSavedToast(false), 2500);
      fetchLeads();
    } catch (err) {
      alert('Failed to save lead details. Please try again.');
    } finally {
      setIsSavingDrawer(false);
    }
  };

  // Delete lead handler
  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the lead for "${selectedLead.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads?id=${selectedLead.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete lead');
      }

      setLeads((prev) => prev.filter((l) => l.id !== selectedLead.id));
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      alert('Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalLeads / pageSize) || 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F3A] flex flex-col font-sans">
      <Helmet>
        <title>Leads Management | Adam International Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* =========================================================================
          TOP BAR
      ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#0B1F3A] text-white h-16 border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#DFBE7A] font-bold">
            A
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Leads</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DFBE7A] bg-[#C9A84C]/15 px-2 py-0.5 rounded-full border border-[#C9A84C]/30 hidden sm:inline-block">
              Portal
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="font-medium truncate max-w-[220px]">{adminEmail || 'admin@adaminternational.in'}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER
      ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* =========================================================================
            STATUS CHIPS
        ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateFilter('status', 'all')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              statusParam === 'all'
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                statusParam === 'all' ? 'bg-[#C9A84C] text-[#0B1F3A]' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {STATUS_OPTIONS.map((st) => {
            const count = counts[st.value] || 0;
            const isActive = statusParam === st.value;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => updateFilter('status', st.value)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    isActive ? 'bg-[#C9A84C] text-[#0B1F3A]' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            FILTERS & SEARCH TOOLBAR
        ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            
            {/* 1. Search Box */}
            <div className="lg:col-span-2 relative">
              <input
                type="text"
                placeholder="Search name, email, or phone…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-slate-50/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Country Filter */}
            <div>
              <select
                value={countryParam}
                onChange={(e) => updateFilter('country', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="all">All Countries</option>
                <option value="Not sure yet">Not sure yet</option>
                {countries.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Service Filter */}
            <div>
              <select
                value={serviceParam}
                onChange={(e) => updateFilter('service', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="all">All Services</option>
                <option value="Not sure yet">Not sure yet</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Branch Filter */}
            <div>
              <select
                value={branchParam}
                onChange={(e) => updateFilter('branch', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="all">All Branches</option>
                <option value="Not sure yet">Not sure yet</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Date Range (IST) */}
            <div>
              <select
                value={rangeParam}
                onChange={(e) => updateFilter('range', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="all">All Time</option>
                <option value="today">Today (IST)</option>
                <option value="7d">Last 7 Days (IST)</option>
                <option value="30d">Last 30 Days (IST)</option>
              </select>
            </div>
          </div>

          {/* Action Row: Export & Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-[#0B1F3A]">{leads.length}</span> of{' '}
              <span className="font-bold text-[#0B1F3A]">{totalLeads}</span> leads matching filters
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchLeads}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Refresh leads"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C9A84C]' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting || totalLeads === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#13335F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>{isExporting ? 'Exporting…' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ERROR BANNER WITH RETRY
        ========================================================================= */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 text-xs sm:text-sm text-rose-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchLeads}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* =========================================================================
            LEADS LIST: DESKTOP TABLE & MOBILE CARDS
        ========================================================================= */}
        {isLoading ? (
          /* SKELETON LOADING STATE */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
            <div className="h-12 bg-slate-100 border-b border-slate-200" />
            <div className="divide-y divide-slate-100">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                    <div className="h-3 w-60 bg-slate-100 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : leads.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B1F3A] mb-1">
              No leads match these filters.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keyword, changing status, or clearing date range filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1F3A]/5 text-[#0B1F3A] font-bold uppercase tracking-wider border-b border-slate-200 select-none text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Date (IST)</th>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Country & Service</th>
                      <th className="py-3.5 px-4">Branch</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {leads.map((lead) => {
                      const digits = lead.phone ? lead.phone.replace(/\D/g, '') : '';
                      const waUrl = digits ? `https://wa.me/${digits}` : null;
                      const telUrl = lead.phone ? `tel:${lead.phone}` : null;
                      const mailtoUrl = lead.email ? `mailto:${lead.email}` : null;

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => openDrawer(lead)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          {/* Date (IST) */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">
                              {formatIST(lead.created_at)}
                            </div>
                            {formatSourcePage(lead.source_page) && (
                              <div
                                className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]"
                                title={formatSourcePage(lead.source_page)}
                              >
                                {formatSourcePage(lead.source_page)}
                              </div>
                            )}
                          </td>

                          {/* Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">
                              {lead.name}
                            </div>
                            {lead.assigned_to && (
                              <div className="text-[10px] text-slate-500 font-medium">
                                Assigned: {lead.assigned_to}
                              </div>
                            )}
                          </td>

                          {/* Contact (Phone, WhatsApp, Email) */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-slate-700">
                              <a
                                href={telUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-[#C9A84C] font-medium"
                                title="Call phone"
                              >
                                {lead.phone}
                              </a>
                              {waUrl && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-emerald-600 hover:text-emerald-700 transition-colors p-0.5 rounded hover:bg-emerald-50"
                                  title="Open WhatsApp chat"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            {mailtoUrl && (
                              <div className="mt-0.5">
                                <a
                                  href={mailtoUrl}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] text-slate-500 hover:text-[#0B1F3A] hover:underline"
                                  title="Send email"
                                >
                                  {lead.email}
                                </a>
                              </div>
                            )}
                          </td>

                          {/* Country & Service */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">
                              {lead.country || '—'}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                              {lead.service || '—'}
                            </div>
                          </td>

                          {/* Branch */}
                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {lead.branch || '—'}
                          </td>

                          {/* Status Inline Dropdown */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={lead.status || 'new'}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C] cursor-pointer"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-3">
              {leads.map((lead) => {
                const digits = lead.phone ? lead.phone.replace(/\D/g, '') : '';
                const waUrl = digits ? `https://wa.me/${digits}` : null;
                const telUrl = lead.phone ? `tel:${lead.phone}` : null;
                const mailtoUrl = lead.email ? `mailto:${lead.email}` : null;

                return (
                  <div
                    key={lead.id}
                    onClick={() => openDrawer(lead)}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-[#C9A84C] transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#0B1F3A] text-sm">{lead.name}</h3>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {formatIST(lead.created_at)}
                        </div>
                        {formatSourcePage(lead.source_page) && (
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {formatSourcePage(lead.source_page)}
                          </div>
                        )}
                      </div>

                      <select
                        value={lead.status || 'new'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Country</span>
                        <span className="font-medium text-slate-800">{lead.country || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service</span>
                        <span className="font-medium text-slate-800 truncate block">{lead.service || '—'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <a
                          href={telUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#0B1F3A] font-semibold hover:text-[#C9A84C]"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                          <span>Call</span>
                        </a>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>

                      {mailtoUrl && (
                        <a
                          href={mailtoUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0B1F3A]"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================================================
                PAGINATION CONTROLS
            ========================================================================= */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm text-xs">
                <div className="text-slate-500">
                  Page <span className="font-bold text-[#0B1F3A]">{pageParam}</span> of{' '}
                  <span className="font-bold text-[#0B1F3A]">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pageParam <= 1}
                    onClick={() => updateFilter('page', String(pageParam - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-slate-700 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    disabled={pageParam >= totalPages}
                    onClick={() => updateFilter('page', String(pageParam + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-slate-700 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          ROW DRAWER MODAL (Lead Details, Notes, Assignment, Delete)
      ========================================================================= */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-[#0B1F3A]/50 backdrop-blur-xs transition-opacity animate-fadeIn"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="h-16 px-6 bg-[#0B1F3A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <h2 className="font-bold text-base text-white truncate max-w-[280px]">
                  {selectedLead.name}
                </h2>
                <div className="text-[10px] text-slate-400 font-mono">
                  ID: {selectedLead.id}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
              {drawerSavedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Lead details saved successfully.</span>
                </div>
              )}

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lead Status
                </label>
                <select
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information Quick Links */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  Contact Details
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Phone:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="font-bold text-[#0B1F3A] hover:text-[#C9A84C]"
                    >
                      {selectedLead.phone}
                    </a>
                    {selectedLead.phone && (
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 p-1 bg-white rounded-md border border-slate-200"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Email:</span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-semibold text-[#0B1F3A] hover:underline truncate max-w-[220px]"
                  >
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date (IST)</span>
                  <span className="font-semibold text-slate-800">{formatIST(selectedLead.created_at)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last Updated (IST)</span>
                  <span className="font-semibold text-slate-800">{formatIST(selectedLead.updated_at)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Country</span>
                  <span className="font-semibold text-slate-800">{selectedLead.country || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service</span>
                  <span className="font-semibold text-slate-800">{selectedLead.service || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Branch</span>
                  <span className="font-semibold text-slate-800">{selectedLead.branch || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">University</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedLead.university || '—'}</span>
                </div>
              </div>

              {/* Source Page & Consent */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Source Page:</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedLead.source_page || '/'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Consent:</span>
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Agreed
                  </span>
                </div>
                {selectedLead.consent_text && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    "{selectedLead.consent_text}"
                  </p>
                )}
              </div>

              {/* Assigned To Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Assigned Advisor (Max 100 chars)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. John Doe, Admissions Team"
                  value={drawerAssignedTo}
                  onChange={(e) => setDrawerAssignedTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>

              {/* Editable Notes Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Internal Notes (Max 5000 chars)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {drawerNotes.length}/5000
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={5000}
                  placeholder="Add notes about candidate background, counseling call, intake preferences..."
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDeleteLead}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting…' : 'Delete Lead'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDrawer}
                disabled={isSavingDrawer}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <span>{isSavingDrawer ? 'Saving…' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
