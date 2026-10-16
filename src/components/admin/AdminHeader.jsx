import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Users, Calendar, BookOpen } from 'lucide-react';

export default function AdminHeader({ adminEmail, onSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    try {
      await fetch('/api/admin/auth?action=logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {}
    navigate('/admin/login', { replace: true });
  };

  const isLeadsActive = pathname === '/admin' || pathname === '/admin/';
  const isEventsActive = pathname.startsWith('/admin/events');
  const isBlogActive = pathname.startsWith('/admin/blog');

  return (
    <header className="sticky top-0 z-30 bg-[#0B1F3A] text-white h-16 border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-md">
      {/* Brand & Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-8">
        <Link to="/admin" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#DFBE7A] font-extrabold text-sm group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="font-bold text-base tracking-tight hidden md:inline">
            Adam International
          </span>
        </Link>

        {/* Tabs: Leads · Events · Blog */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/admin"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all no-underline ${
              isLeadsActive
                ? 'bg-white/15 text-[#DFBE7A] shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads</span>
          </Link>

          <Link
            to="/admin/events"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all no-underline ${
              isEventsActive
                ? 'bg-white/15 text-[#DFBE7A] shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </Link>

          <Link
            to="/admin/blog"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all no-underline ${
              isBlogActive
                ? 'bg-white/15 text-[#DFBE7A] shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog</span>
          </Link>
        </nav>
      </div>

      {/* Admin User Info & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <User className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
          <span className="font-medium truncate max-w-[130px] sm:max-w-[200px]">
            {adminEmail || 'admin@adaminternational.in'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
