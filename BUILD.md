# Build Instructions

## Single Command Run

To build the application for your current platform (and universal DMG on macOS), run:

```bash
npm run build:all
```

This will:

1. Check requirements.
2. Build the frontend (`dist/`).
3. Build the desktop installer(s) using `scripts/build-desktop.js`.
   - On **macOS**, this attempts to build a **Universal Binary** (Intel + Apple Silicon).
   - On Windows/Linux, it builds for the host architecture.
4. Move artifacts to the `release/` directory.

## Output Locations

- **macOS**: `release/TypingPro-<version>_universal.dmg` (or standard .dmg)
- **Windows**: `release/TypingPro-<version>-x64.exe`
- **Linux**: `release/typingpro_<version>_amd64.deb` & `.AppImage`

> **Note**: To build for Windows/Linux while on macOS, please use the GitHub Actions workflow (`.github/workflows/release.yml`) as cross-compilation requires complex environment setup.
