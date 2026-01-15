import { useEffect } from 'react'
import { useDevStore } from '../stores/devStore'

/**
 * useLockdown Hook
 * 
 * Enforces a strict "Kiosk-like" mode by:
 * 1. Blocking Context Menu (Right-Click)
 * 2. Blocking DevTools shortcuts (F12, Ctrl+Shift+I, etc.)
 * 3. Blocking Selection/Copy shortcuts (Ctrl+A, Ctrl+C) - Optional, kept open for now but can be strict.
 */
export const useLockdown = () => {
    const isDevMode = useDevStore((state) => state.isDevMode);

    useEffect(() => {
        if (isDevMode) return; // BYPASS LOCKDOWN IN DEV MODE

        // 1. Block Context Menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            return false
        }

        // 2. Block Shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault()
                return false
            }

            // Block Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault()
                return false
            }

            // Block Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault()
                return false
            }

            // Block Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault()
                return false
            }

            // Block Command+Option+I (Mac DevTools)
            if (e.metaKey && e.altKey && e.key === 'i') {
                e.preventDefault()
                return false
            }
        }

        window.addEventListener('contextmenu', handleContextMenu)
        window.addEventListener('keydown', handleKeyDown)

        // Disable standard drag-and-drop behavior
        const handleDragStart = (e: DragEvent) => {
            e.preventDefault()
            return false
        }
        window.addEventListener('dragstart', handleDragStart)

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('dragstart', handleDragStart)
        }
    }, [])
}
