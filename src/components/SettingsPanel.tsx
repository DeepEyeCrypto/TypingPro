import React from 'react'
import { useSettingsStore, ThemeType, CaretStyle } from '@src/stores/settingsStore'
import './SettingsPanel.css'

interface SettingsPanelProps {
    onClose: () => void
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
    const settings = useSettingsStore()

    const themes: { id: ThemeType, label: string }[] = [
        { id: 'classic', label: 'Classic Dark' },
        { id: 'glass', label: 'Liquid Glass' },
        { id: 'high-contrast', label: 'High Contrast' }
    ]

    const carets: { id: CaretStyle, label: string }[] = [
        { id: 'line', label: 'Line' },
        { id: 'block', label: 'Block' },
        { id: 'underline', label: 'Underscore' },
        { id: 'hidden', label: 'Hidden' }
    ]

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>Configuration</h2>
                    <button className="close-btn" onClick={onClose}>ESC</button>
                </div>

                <div className="setting-group">
                    <span className="setting-label">Theme Preset</span>
                    <div className="option-grid">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                className={`option-btn ${settings.theme === t.id ? 'active' : ''}`}
                                onClick={() => settings.setTheme(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="setting-group">
                    <span className="setting-label">Caret Style</span>
                    <div className="option-grid">
                        {carets.map(c => (
                            <button
                                key={c.id}
                                className={`option-btn ${settings.caretStyle === c.id ? 'active' : ''}`}
                                onClick={() => settings.setCaretStyle(c.id)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="setting-group">
                    <span className="setting-label">Font Size</span>
                    <div className="font-size-row">
                        <input
                            type="range"
                            min="16"
                            max="48"
                            step="2"
                            value={settings.fontSize}
                            onChange={(e) => settings.setFontSize(parseInt(e.target.value))}
                        />
                        <span className="size-preview">{settings.fontSize}px</span>
                    </div>
                </div>

                <div className="setting-group">
                    <span className="setting-label">Interface Font</span>
                    <div className="option-grid">
                        {['Inter', 'JetBrains Mono', 'Roboto', 'Outfit'].map(font => (
                            <button
                                key={font}
                                className={`option-btn ${settings.fontFamily === font ? 'active' : ''}`}
                                onClick={() => settings.setFontFamily(font)}
                            >
                                {font}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
