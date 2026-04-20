import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-6">
            <ShieldAlert size={40} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            System Error Detected
          </h2>
          <p className="text-slate-500 font-medium max-w-md mb-2">
            {this.props.fallbackMessage || 'A rendering error occurred in this panel. This has been isolated to prevent system-wide failure.'}
          </p>
          <p className="text-xs font-mono text-slate-400 bg-slate-100 px-4 py-2 rounded-lg mb-8 max-w-lg break-all">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <RefreshCw size={16} />
              Retry Panel
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              <Home size={16} />
              Return to Base
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
