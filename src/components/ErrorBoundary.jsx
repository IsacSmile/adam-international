import React from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console only as requested
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-[60vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF7F2]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                Something went wrong on this page
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                An unexpected error occurred while rendering this page. You can try reloading or returning to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142B4C] text-[#C9A84C] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Reload</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Go to homepage</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
