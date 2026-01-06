import React from 'react'
import ReactDOM from 'react-dom/client'
import { ZenOverlay } from './components/ZenOverlay'
import './styles/zen-overlay.css'

ReactDOM.createRoot(document.getElementById('zen-root')!).render(
    <React.StrictMode>
        <ZenOverlay />
    </React.StrictMode>,
)
