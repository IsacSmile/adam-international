import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // If already authenticated, redirect straight to /admin
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/auth?action=me', { credentials: 'same-origin' })
      .then((res) => {
        if (res.ok && isMounted) {
          navigate('/admin', { replace: true });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        navigate('/admin', { replace: true });
      } else {
        // Show the server's error message as-is
        setErrorMessage(data?.error || 'Incorrect email or password.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071324] flex items-center justify-center p-4 selection:bg-[#C9A84C] selection:text-[#0B1F3A]">
      <Helmet>
        <title>Admin Sign In | Adam International</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0B1F3A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header with Shield Icon */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#DFBE7A] mx-auto mb-4 shadow-inner">
            <Shield className="w-6 h-6 text-[#C9A84C]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Adam International
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Leads Management Portal
          </p>
        </div>

        {/* Server error message displayed as-is */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs sm:text-sm text-rose-300 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#C9A84C] hover:bg-[#DFBE7A] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B1F3A] font-bold py-3 px-6 rounded-xl transition-all shadow-lg text-sm cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
