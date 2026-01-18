import React from 'react'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { useSettingsStore, ThemeType, CaretStyle } from '../../../core/store/settingsStore'
import { SOUND_PROFILES } from '../../../data/soundProfiles'
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
            <div className="settings-panel glass-unified" onClick={e => e.stopPropagation()}>
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
                    <span className="setting-label">Audio</span>
                    <div className="audio-controls">
                        <div className="toggle-row">
                            <span className="sub-label">Sound Effects</span>
                            <button
                                className={`option-btn ${settings.soundEnabled ? 'active' : ''}`}
                                onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
                            >
                                {settings.soundEnabled ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        <div className="volume-row">
                            <span className="sub-label">Volume</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={settings.soundVolume}
                                onChange={(e) => settings.setSoundVolume(parseInt(e.target.value))}
                                className="volume-slider"
                            />
                            <span className="value-preview">{settings.soundVolume}%</span>
                        </div>

                        <div className="profile-grid">
                            {SOUND_PROFILES.map(p => (
                                <button
                                    key={p.id}
                                    className={`profile-btn ${settings.activeSoundProfileId === p.id ? 'active' : ''}`}
                                    onClick={() => settings.setSoundProfile(p.id)}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
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

                <div className="setting-group">
                    <span className="setting-label">Software Updates</span>
                    <UpdateChecker />
                </div>
            </div>
        </div>
    )
}

const UpdateChecker = () => {
    const [status, setStatus] = React.useState<'idle' | 'checking' | 'available' | 'uptodate' | 'error'>('idle')
    const [version, setVersion] = React.useState('')
    const [updateObj, setUpdateObj] = React.useState<any>(null)

    const checkUpdate = async () => {
        try {
            setStatus('checking')
            const update = await check()
            if (update) {
                setVersion(update.version)
                setUpdateObj(update)
                setStatus('available')
            } else {
                setStatus('uptodate')
            }
        } catch (e) {
            console.error(e)
            setStatus('error')
        }
    }

    const installUpdate = async () => {
        if (!updateObj) return
        try {
            setStatus('checking') // Re-use checking style for installing
            await updateObj.downloadAndInstall()
            await relaunch()
        } catch (e) {
            console.error(e)
            setStatus('error')
        }
    }

    return (
        <div className="update-checker">
            <button
                className={`glass-btn ${status === 'checking' ? 'loading' : ''}`}
                onClick={checkUpdate}
                disabled={status === 'checking' || status === 'available'}
            >
                {status === 'checking' ? 'Checking...' : 'Check for Updates'}
            </button>
            {status === 'uptodate' && <span className="status-text success">You are on the latest version.</span>}
            {status === 'available' && (
                <div className="update-available">
                    <span>v{version} is available!</span>
                    <button className="glass-btn primary" onClick={installUpdate}>Download & Install</button>
                </div>
            )}
            {status === 'error' && <span className="status-text error">Failed to check for updates.</span>}
        </div>
    )
}
