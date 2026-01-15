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
                    color: '#000',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '2rem',
                    height: '100vh',
                    width: '100vw',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    zIndex: 99999,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', fontWeight: 900, letterSpacing: '0.5em', color: '#000' }}>SYSTEM_RECOVERY_MODE</h1>
                    <h3 style={{ color: '#000', opacity: 0.8, marginTop: '2rem' }}>CRITICAL_FAILURE: {err?.toString()}</h3>
                    <pre style={{
                        background: 'rgba(0,0,0,0.05)',
                        padding: '1rem',
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap',
                        color: 'rgba(0,0,0,0.6)'
                    }}>
                        {err?.stack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2.5rem',
                            padding: '1.2rem 3rem',
                            background: 'rgba(0,0,0,0.05)',
                            color: '#000',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.2em',
                        }}
                    >
                        INITIALIZE_REBOOT
                    </button>
                    {this.props.fallback}
                </div>
            );
        }

        return this.props.children;
    }
}
