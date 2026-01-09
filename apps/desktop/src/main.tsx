import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from '../../../src/components/ErrorBoundary'

declare global {
  interface Window {
    debugLog: (msg: string, type?: string) => void;
  }
}

try {
  window.debugLog('main.tsx: Starting bootstrap...');
  const rootElement = document.getElementById('root') as HTMLElement
  if (!rootElement) {
    window.debugLog('main.tsx: ERROR - Root element not found', 'ERROR');
    throw new Error("Root element not found");
  }

  window.debugLog('main.tsx: Rendering React root...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary fallback={<div style={{ color: 'white', padding: '50px', background: '#050505', height: '100vh', zIndex: 9999, position: 'relative', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#ff4444' }}>APPLICATION ERROR</h1>
        <p>The application encountered a critical error during startup.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Reload Application</button>
      </div>}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
  window.debugLog('main.tsx: Render call complete');
} catch (e: any) {
  window.debugLog(`main.tsx: CRITICAL CRASH - ${e?.message}`, 'ERROR');
  document.body.innerHTML = `<div style="color:white; background:red; padding:20px; font-family:monospace;">
    <h1>CRITICAL FRONTEND CRASH</h1>
    <p>${e?.message || 'Unknown Error'}</p>
    <pre>${e?.stack || ''}</pre>
  </div>`
}
