import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth?action=me', {
          credentials: 'same-origin',
        });
        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          setAdmin(data);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('unauthenticated');
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col animate-pulse">
        {/* Top bar skeleton */}
        <div className="h-16 bg-[#0B1F3A] border-b border-white/10 px-6 flex items-center justify-between">
          <div className="h-6 w-32 bg-white/10 rounded-md" />
          <div className="h-6 w-48 bg-white/10 rounded-md" />
        </div>
        {/* Content skeleton */}
        <div className="max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
          <div className="h-10 w-64 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children
        ? React.isValidElement(children)
          ? React.cloneElement(children, { admin })
          : children
        : <Outlet context={{ admin }} />}
    </>
  );
}

