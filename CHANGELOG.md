# Changelog

All notable changes to this project will be documented in this file.

## [0.0.5] - 2025-12-12

### Added
-   **Manual Update Button**: Added a dedicated button in the header to manually check for updates.
-   **IPC Handler**: Wired `checkForUpdates` logic directly to the main process auto-updater.

## [0.0.4] - 2025-12-12

### Changed
-   **Default Typography**: Updated default font to "Cinzel" and increased default font size to "Extra Large" for better readability.

## [0.0.3] - 2025-12-12

### Added
-   **Video Tutorials**: Integrated instructional videos for "Introduction to Touch Typing" and "Home Row" basics.
-   **Smart Lesson Flow**: Automatically plays the introductory video before starting Lesson 1 (Home Row).
-   **Auto-Update**: Implemented automatic background update checks using GitHub Releases.
-   **Notifications**: Added polished toast notifications (via logs) for update status.

### Changed
-   **Documentation**: Completely rewrote `README.md` with a modern, professional design and badge support.
-   **Build System**: Configured `electron-builder` to support simultaneous multi-platform builds (macOS, Windows, Linux).

### Fixed
-   **Package Configuration**: Fixed JSON syntax errors in `package.json`.
-   **Lesson Navigation**: Improved lesson unlocking logic and progress tracking.

---
## [0.0.2] - 2025-12-11

### Added
-   **User Profiles**: Support for multiple user profiles with independent progress tracking.
-   **Dark Mode**: System-aware dark mode implementation.
-   **Virtual Keyboard**: Visual keyboard guide with real-time key highlighting.

### Changed
-   **UI Overhaul**: Refactored entire UI to use Tailwind CSS for a cleaner, responsive design.
-   **Performance**: Optimized React rendering performance for low-latency typing.
