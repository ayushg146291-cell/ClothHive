import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-gray-950 to-gray-950" />
          
          <div className="relative glass rounded-[2rem] p-10 max-w-md w-full text-center border border-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.15)] z-10 backdrop-blur-2xl">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-red-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            
            <h1 className="text-3xl font-black mb-3 tracking-tight">System Fault</h1>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              An unexpected spatial anomaly occurred. We've captured the telemetry and are restoring normal operations.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden group transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                Initialize Restart
              </span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
