import React, { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { fetch } from '@tauri-apps/plugin-http' // Use standard fetch or plugin if needed, but standard fetch usually works in Tauri 2 with perms.
// Note: In Tauri v2, standard 'fetch' works if CSP allows it.

interface Release {
    tag_name: string
    name: string
    body: string
    published_at: string
}

const GITHUB_REPO = 'DeepEyeCrypto/TypingPro'

export const WhatsNewModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [release, setRelease] = useState<Release | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkVersion()
    }, [])

    const checkVersion = async () => {
        try {
            const currentVersion = await getVersion()
            const lastSeenVersion = localStorage.getItem('last_seen_version')

            // If it's a fresh update or first time
            if (currentVersion !== lastSeenVersion) {
                // Fetch release notes
                await fetchLatestRelease()
                // Do not auto-close; let user close and then set localStorage
            }
        } catch (e) {
            console.error('Failed to check version:', e)
        }
    }

    const fetchLatestRelease = async () => {
        setLoading(true)
        try {
            const response = await window.fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`)
            if (response.ok) {
                const data = await response.json()
                setRelease(data)
                setIsOpen(true)
            }
        } catch (e) {
            console.error('Failed to fetch release notes:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = async () => {
        setIsOpen(false)
        try {
            const currentVersion = await getVersion()
            localStorage.setItem('last_seen_version', currentVersion)
        } catch (e) {
            console.error('Failed to save version state', e)
        }
    }

    if (!isOpen || !release) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="liquid-glass-card max-w-2xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 transform overflow-hidden shadow-2xl border border-[color:var(--glass-border)]"
                style={{ backgroundColor: 'var(--bg-color)' }}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[color:var(--glass-border)] bg-[color:var(--glass-bg)]">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚀</span>
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: 'var(--accent-color)' }}>What's New</h2>
                            <p className="text-xs opacity-70">TypingPro {release.tag_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="prose prose-invert max-w-none">
                        {/* 
                            Simple formatting for headers and lists since we don't have a markdown parser installed yet.
                            In a real scenario, we'd use react-markdown. 
                            For now, we display the raw text with whitespace preservation which is surprisingly readable for standard MD.
                        */}
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-family)' }}>
                            {release.body}
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'var(--bg-color)'
                        }}
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    )
}
