# TypingPro Debugging Guide: Startup & Auth

This guide is intended for developers to troubleshoot and maintain the newly implemented non-blocking startup and defensive auth listener.

## 🔍 Troubleshooting Startup Stalls

If the splash screen stays visible for more than 2 seconds:

1. **Check DevTools Console**:
   - Look for `[App] Initializing Auth Listener...`.
   - If this is missing, the `useEffect` in `App.tsx` might not be firing.
2. **Verify `setIsLoading` trigger**:
   - Check if `setTimeout(() => setIsLoading(false), 800)` exists and is reachable.
3. **Inspect Background Tasks**:
   - Background tasks are logged as they complete. If one is throwing a silent error, it will be caught and logged (e.g., `Session initialization fail`).

## 🔑 Troubleshooting Auth Crashes

If the app crashes with a white screen or frozen splash:

1. **Check for `TypeError` on `onDeepLinkOpenUrl`**:
   - Even though it's wrapped in a `try/catch`, check if the catch block is firing.
   - If the plugin is missing, ensure `tauri-plugin-deep-link` is correctly listed in `Cargo.toml` and `package.json`.
2. **Deep Link vs Localhost**:
   - In development, the app often uses `window.location.search` for auth.
   - The fix guards against the *Production* deep-link listener failing in *Development* environments.

## 🛠️ Performance Auditing

To verify the non-blocking nature:

1. Open Chrome/Tauri DevTools.
2. Navigate to the **Performance** tab.
3. Record a "Reload" start.
4. Observe the "Long Tasks". The startup sequence should now show many small, discrete tasks instead of one monolithic 5-second blocking task.

## 📡 Sync & Lifecycle Issues

Since sync now happens in the background while the UI is visible:

- **Consistency**: If a user immediately navigates to a page that depends on synced data (like `Stats`), they might see a "Loading" state or cached local data until the background sync completes.
- **Race Conditions**: `syncService.pullFromCloud()` is awaited in the background *before* the dashboard is strictly "ready" for data-heavy operations, but the UI is interactive.

---
*End of Debugging Guide*
