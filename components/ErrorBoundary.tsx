import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl max-w-lg w-full border border-red-100 dark:border-red-900/50">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            The application encountered an unexpected error.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-left overflow-auto max-h-48 mb-6 border border-gray-200 dark:border-gray-700">
                            <code className="text-red-600 dark:text-red-400 text-xs font-mono break-all whitespace-pre-wrap">
                                {this.state.error?.toString()}
                            </code>
                            {this.state.errorInfo && (
                                <details className="mt-2 text-xs text-gray-500">
                                    <summary>Stack Trace</summary>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            <RefreshCcw size={18} />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
