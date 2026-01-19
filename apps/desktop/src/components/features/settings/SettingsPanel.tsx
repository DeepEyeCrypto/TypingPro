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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-[var(--glass-bg)] border border-glass rounded-[2rem] p-8 w-full max-w-lg shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>Configuration</h2>
                    <button className="px-3 py-1 bg-[var(--glass-hover)] border border-glass rounded-lg text-[10px] font-black opacity-40 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }} onClick={onClose}>ESC</button>
                </div>

                <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-20" style={{ color: 'var(--text-primary)' }}>Theme Preset</span>
                    <div className="grid grid-cols-2 gap-2">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border ${settings.theme === t.id
                                    ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)] shadow-lg'
                                    : 'bg-[var(--glass-bg)] border-glass opacity-60 hover:opacity-100 hover:bg-[var(--glass-hover)]'}`}
                                style={{ color: settings.theme === t.id ? 'white' : 'var(--text-primary)' }}
                                onClick={() => settings.setTheme(t.id)}
                            >
                                {t.label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-20" style={{ color: 'var(--text-primary)' }}>Audio Engine</span>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] border border-glass rounded-2xl">
                            <span className="font-black text-sm uppercase tracking-tight italic opacity-80" style={{ color: 'var(--text-primary)' }}>Sound Effects</span>
                            <button
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${settings.soundEnabled ? 'bg-[var(--text-accent)] text-white' : 'bg-[var(--glass-hover)] border-glass opacity-40'}`}
                                onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
                            >
                                {settings.soundEnabled ? 'AUTHORIZED' : 'DISABLED'}
                            </button>
                        </div>
                        <div className="flex items-center gap-6 px-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Level</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={settings.soundVolume}
                                onChange={(e) => settings.setSoundVolume(parseInt(e.target.value))}
                                className="w-full h-1 bg-[var(--glass-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-accent)]"
                            />
                            <span className="text-[10px] font-black opacity-60 w-8" style={{ color: 'var(--text-primary)' }}>{settings.soundVolume}%</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {SOUND_PROFILES.map(p => (
                                <button
                                    key={p.id}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-tight transition-all border ${settings.activeSoundProfileId === p.id
                                        ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)] shadow-md'
                                        : 'bg-[var(--glass-bg)] border-glass opacity-40 hover:opacity-100'}`}
                                    style={{ color: settings.activeSoundProfileId === p.id ? 'white' : 'var(--text-primary)' }}
                                    onClick={() => settings.setSoundProfile(p.id)}
                                >
                                    {p.name.split(' ')[0]}
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
