import { useEffect, useState } from 'react'
import { check } from '@tauri-apps/plugin-updater'
import { ask } from '@tauri-apps/plugin-dialog'
import { relaunch } from '@tauri-apps/plugin-process'

export const useUpdater = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false)
    const [version, setVersion] = useState('')

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await check()
                if (update?.available) {
                    setUpdateAvailable(true)
                    setVersion(update.version)

                    const yes = await ask(
                        `Update to v${update.version} is available!\n\nRelease notes: ${update.body}`,
                        { title: 'Update Available', kind: 'info', okLabel: 'Update', cancelLabel: 'Later' }
                    )

                    if (yes) {
                        await update.downloadAndInstall()
                        await relaunch()
                    }
                }
            } catch (error) {
                console.error('Failed to check for updates:', error)
            }
        }

        checkForUpdates()
    }, [])

    return { updateAvailable, version }
}
