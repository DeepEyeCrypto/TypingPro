import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from '../../../src/components/ErrorBoundary'

try {
  const rootElement = document.getElementById('root') as HTMLElement
  if (!rootElement) throw new Error("Root element not found")

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
} catch (e: any) {
  document.body.innerHTML = `<div style="color:white; background:red; padding:20px; font-family:monospace;">
    <h1>CRITICAL FRONTEND CRASH</h1>
    <p>${e?.message || 'Unknown Error'}</p>
    <pre>${e?.stack || ''}</pre>
  </div>`
}
