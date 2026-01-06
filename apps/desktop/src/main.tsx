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
      <ErrorBoundary fallback={<div style={{ color: 'red', padding: '50px', background: 'black', height: '100vh' }}>APPLICATION CRASHED. CHECK CONSOLE.</div>}>
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
