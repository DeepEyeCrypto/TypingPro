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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300 backdrop-blur-[50px]">
            <div className="glass-perfect max-w-2xl w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-300 transform overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),_0_20px_40px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-black/5 bg-black/5">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl filter grayscale">🚀</span>
                        <div>
                            <h2 className="text-xl font-bold mono-text-interactive">What's New</h2>
                            <p className="text-[10px] uppercase tracking-widest mono-text-interactive opacity-40">TypingPro {release.tag_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors mono-text-interactive opacity-60 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed mono-text-interactive text-white opacity-80">
                            {release.body}
                        </pre>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-sm"
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    )
}
