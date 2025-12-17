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
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
                    <div className="bg-red-800/20 border border-red-500 rounded-lg p-6 max-w-lg text-center">
                        <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h1>
                        <p className="mb-4 text-gray-300">
                            The application encountered an unexpected error.
                        </p>
                        <pre className="text-xs bg-black/50 p-4 rounded text-left overflow-auto mb-6 max-h-40">
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition"
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
