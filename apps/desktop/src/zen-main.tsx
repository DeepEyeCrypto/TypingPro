import React from 'react'
import ReactDOM from 'react-dom/client'
import { ZenOverlay } from './components/features/typing/ZenOverlay'
import './index.css'

ReactDOM.createRoot(document.getElementById('zen-root')!).render(
    <React.StrictMode>
        <ZenOverlay />
    </React.StrictMode>,
)
