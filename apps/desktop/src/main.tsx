import './index.css'
import './styles/tailwind.css'
import './styles/glass-perfect.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from '../../../src/components/ErrorBoundary'

const ErrorFallback = ({ message, stack }: { message: string, stack?: string }) => (
  <div style={{
    color: 'white',
    padding: '40px',
    background: '#0a0a0a',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    position: 'fixed',
    top: 0,
    left: 0,
    fontFamily: 'monospace',
    textAlign: 'center'
  }}>
    <h1 style={{ color: '#ff4444', marginBottom: '20px', fontSize: '1.5rem' }}>CRITICAL STARTUP ERROR</h1>
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', maxWidth: '80%', overflow: 'auto' }}>
      <p style={{ fontWeight: 'bold' }}>{message}</p>
      {stack && <pre style={{ fontSize: '0.7rem', color: '#888', textAlign: 'left', marginTop: '10px' }}>{stack}</pre>}
    </div>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '12px 24px',
        marginTop: '30px',
        cursor: 'pointer',
        background: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }}
    >
      RELOAD APPLICATION
    </button>
  </div>
);

async function init() {
  const rootElement = document.getElementById('root') as HTMLElement
  if (!rootElement) return;

  const root = ReactDOM.createRoot(rootElement);

  try {
    console.log("APP_STARTUP: Initializing...");

    // Dynamically import App to catch evaluation errors
    const { default: App } = await import('./App');

    root.render(
      <React.StrictMode>
        <ErrorBoundary fallback={<ErrorFallback message="React Runtime Error" />}>
          <Suspense fallback={<div style={{ background: '#050505', height: '100vh' }} />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log("APP_STARTUP: Main Render Triggered");

  } catch (e: any) {
    console.error("APP_STARTUP: Critical failure", e);
    root.render(<ErrorFallback message={e?.message || 'Unknown Initialization Error'} stack={e?.stack} />);
  }
}

init().catch(e => {
  console.error("FATAL: Global init fail", e);
  document.body.innerHTML = `<div style="color:white; background:black; padding:40px;"><h1>FATAL CRASH</h1><p>${e.message}</p></div>`;
});
