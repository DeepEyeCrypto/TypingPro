import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Glass Styled
 * Prevents the entire app from crashing on local component failures.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error caught by ${this.props.name || 'Boundary'}:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
                    <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                            <AlertTriangle className="text-red-500 w-10 h-10" />
                        </div>

                        <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
                        <p className="text-white/40 mb-8 text-sm leading-relaxed">
                            We've encountered an unexpected error. Don't worry, your progress is likely safe.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-4 bg-brand hover:scale-105 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand/20"
                            >
                                <RefreshCw size={18} /> Reload Application
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl font-bold transition-all border border-white/5 flex items-center justify-center gap-2"
                            >
                                <Home size={18} /> Return Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 text-left overflow-auto max-h-40">
                                <code className="text-pink-400 text-xs font-mono">{this.state.error?.message}</code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
