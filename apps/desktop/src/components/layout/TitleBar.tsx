import React from 'react'
import './TitleBar.css'

export const TitleBar = () => {
    return (
        <div className="titlebar" data-tauri-drag-region>
            {/* macOS traffic lights will appear here automatically with titleBarStyle: Overlay */}
        </div>
    )
}
