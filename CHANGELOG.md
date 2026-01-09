# Changelog

All notable changes to this project will be documented in this file.

## [1.2.11] - 2026-01-09

### Added

- **Liquid Glass V5 UI**: Completely overhauled the `UsernameModal` with premium radial gradients, glowing hairline borders, and polished typography.
- **Enhanced Diagnostics**: Improved error reporting in the `UsernameModal` to better identify missing production secrets.

### Fixed

- **Module Initialization**: Further refactored service layer to ensure no database calls occur during static module evaluation.

## [1.2.10] - 2026-01-09

### Fixed

- **Startup Logic**: Fixed a "Expected first argument to collection() to be a CollectionReference" crash occurring during module evaluation. Refactored `matchmakingService.ts` to use lazy getters for collection references, ensuring the database is fully initialized before being accessed.
- **Initialization Resilience**: Improved dependency ordering to ensure services aren't initialized before their data providers.

## [1.2.9] - 2026-01-09

### Fixed

- **Critical Asset Loading**: Disabled CSS code splitting in the production build. This fixes the "Unable to preload CSS" error encountered in version 1.2.8, which was caused by WebKit failing to resolve dynamic CSS chunks through the Tauri custom protocol.
- **Compatibility**: Modernized build target to Safari 14 to ensure better support for modern module loading and CSS preloading behaviors.

## [1.2.8] - 2026-01-09

### Fixed

- **Emergency Startup Fix**: Hardened `main.tsx` with dynamic module loading and a robust error diagnostic overlay to prevent silent black screens.
- **Service Logic**: Corrected an invalid Firestore object guard in `userService.ts` that was causing authentication and profile lookups to fail in production environments.
- **UI Resilience**: Added a `Suspense` and `ErrorBoundary` hierarchy to ensure the UI remains predictable even during component failures.

## [1.2.7] - 2026-01-09

### Fixed

- **Username Creation**: Hardened profile creation logic with granular timeouts (5-8s) to prevent indefinite hanging on slow networks.
- **Error Messages**: Improved UI feedback in the "Choose your identity" modal with more descriptive network error messages.
- **Firebase Diagnostics**: Added project ID verification and initialization logging for easier production tracing.

## [0.0.5] - 2025-12-12

### Added

- **Manual Update Button**: Added a dedicated button in the header to manually check for updates.
- **IPC Handler**: Wired `checkForUpdates` logic directly to the main process auto-updater.

## [0.0.4] - 2025-12-12

### Changed

- **Default Typography**: Updated default font to "Cinzel" and increased default font size to "Extra Large" for better readability.

## [0.0.3] - 2025-12-12

### Added

- **Video Tutorials**: Integrated instructional videos for "Introduction to Touch Typing" and "Home Row" basics.
- **Smart Lesson Flow**: Automatically plays the introductory video before starting Lesson 1 (Home Row).
- **Auto-Update**: Implemented automatic background update checks using GitHub Releases.
- **Notifications**: Added polished toast notifications (via logs) for update status.

### Changed

- **Documentation**: Completely rewrote `README.md` with a modern, professional design and badge support.
- **Build System**: Configured `electron-builder` to support simultaneous multi-platform builds (macOS, Windows, Linux).

### Fixed

- **Package Configuration**: Fixed JSON syntax errors in `package.json`.
- **Lesson Navigation**: Improved lesson unlocking logic and progress tracking.

---

## [0.0.2] - 2025-12-11

### Added

- **User Profiles**: Support for multiple user profiles with independent progress tracking.
- **Dark Mode**: System-aware dark mode implementation.
- **Virtual Keyboard**: Visual keyboard guide with real-time key highlighting.

### Changed

- **UI Overhaul**: Refactored entire UI to use Tailwind CSS for a cleaner, responsive design.
- **Performance**: Optimized React rendering performance for low-latency typing.
