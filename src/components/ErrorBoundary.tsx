import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean,
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="error-screen">
                    <div className="error-content">
                        <h1>System Alert</h1>
                        <p>An unexpected exception has occurred in the typing engine core.</p>
                        <pre>{this.state.error?.message}</pre>
                        <button onClick={() => window.location.reload()}>Reboot Protocol</button>
                    </div>
                    <style>{`
            .error-screen {
              height: 100vh;
              width: 100vw;
              background: #000;
              color: #ff4444;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'JetBrains Mono', monospace;
              padding: 2rem;
            }
            .error-content {
              max-width: 600px;
              border: 0.5px solid #ff4444;
              padding: 2rem;
              background: rgba(255, 68, 68, 0.05);
              border-radius: 8px;
            }
            h1 { font-size: 1.2rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1rem; }
            p { color: #888; font-size: 0.8rem; margin-bottom: 1.5rem; }
            pre { background: rgba(0,0,0,0.5); padding: 1rem; font-size: 0.7rem; color: #ff8888; overflow-x: auto; margin-bottom: 1.5rem; }
            button {
              background: #ff4444;
              color: #000;
              border: none;
              padding: 0.75rem 1.5rem;
              font-family: inherit;
              font-weight: bold;
              text-transform: uppercase;
              cursor: pointer;
              border-radius: 4px;
            }
          `}</style>
                </div>
            )
        }

        return this.props.children
    }
}
