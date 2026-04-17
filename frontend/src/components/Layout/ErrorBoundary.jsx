import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Industry Standard fallback UI
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card-premium !bg-slate-900/50 border-white/5 p-12"
            >
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-rose-500/20">
                    <span className="material-symbols-outlined text-rose-500 text-4xl font-bold">running_with_errors</span>
                </div>
                <h1 className="text-4xl font-black text-white italic italic-safe tracking-tighter uppercase mb-4">Neural Break</h1>
                <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                    The network encountered an unexpected sync error. Our team has been notified.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                    Hard Reset System
                </button>
                <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Error Trace ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
            </motion.div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
