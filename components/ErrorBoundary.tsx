import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the full stack trace to the console in both dev and prod for debugging
        console.error('Uncaught error:', error);
        console.error('Component Stack:', errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
                    <div className="bg-red-800/20 border border-red-500 rounded-lg p-6 max-w-lg text-center shadow-2xl backdrop-blur-sm">
                        <h1 className="text-2xl font-bold mb-4 text-red-500 flex items-center justify-center gap-2">
                            <span>⚠️</span> Something went wrong
                        </h1>
                        <p className="mb-6 text-gray-300">
                            The application encountered an unexpected error.
                        </p>

                        {/* In production, we might want to hide the stack trace from the UI, 
                            but keeping it collapsible or hidden by default is good practice if per user request "friendly in prod". 
                            We will hide the raw stack trace container unless we are debugging. 
                            actually, user asked: "in production it still shows the friendly error UI" 
                            leaving out the pre block or making it dev-only would be safer.
                            Let's use a subtle check. */}
                        {(process.env.NODE_ENV === 'development') && (
                            <pre className="text-[10px] bg-black/50 p-4 rounded text-left overflow-auto mb-6 max-h-40 font-mono text-status-error">
                                {this.state.error?.toString()}
                                {this.state.error?.stack}
                            </pre>
                        )}

                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition shadow-lg"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
