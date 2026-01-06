import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }; // Store error
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            const err = (this.state as any).error; // Cast to access error
            return (
                <div style={{
                    color: '#ff5555',
                    backgroundColor: '#1a0000',
                    padding: '2rem',
                    height: '100vh',
                    width: '100vw',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    zIndex: 99999,
                    position: 'fixed',
                    top: 0,
                    left: 0
                }}>
                    <h1 style={{ borderBottom: '1px solid #ff5555', paddingBottom: '1rem' }}>APPLICATION CRASHED</h1>
                    <h3 style={{ color: '#fff' }}>{err?.toString()}</h3>
                    <pre style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap',
                        color: '#aaa'
                    }}>
                        {err?.stack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '1rem 2rem',
                            background: '#ff5555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        RELOAD APP
                    </button>
                    {this.props.fallback}
                </div>
            );
        }

        return this.props.children;
    }
}
