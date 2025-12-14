# Build Instructions

This project is configured to build for macOS (Intel & Silicon), Windows, and Linux.

## 🚀 Quick Start

To build for all supported platforms on your current OS:

```bash
npm run build:all
```

To build **without** bumping the version number:

```bash
npm run build:all -- --no-bump
```

## 📦 Artifacts

Artifacts are generated in the `release/` directory with the following naming convention:

- **macOS (Intel)**: `TypingPro-<version>-mac-x64.dmg`
- **macOS (Silicon)**: `TypingPro-<version>-mac-arm64.dmg`
- **Windows**: `TypingPro-<version>-win-x64.exe`
- **Linux (Deb)**: `typingpro_<version>_amd64.deb`
- **Linux (AppImage)**: `TypingPro-<version>-linux-x64.AppImage`

## 🛠 Prerequisites

### macOS Requirements
To build both Intel and Apple Silicon DMGs on a macOS machine, you must add the Rust targets:

```bash
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin
```

### Cross-Compilation Notes
Tauri relies on native system libraries for bundling (NSIS for Windows, GTK for Linux).

- **On macOS**: You CANNOT build Windows `.exe` or Linux `.deb` locally without strictly configured cross-compilation toolchains or Docker. The `build:all` script will **skip** these targets and warn you if run on macOS.
- **Solution**: Use the provided **GitHub Actions** workflow (`.github/workflows/release.yml`) which automatically builds correct native binaries for all platforms whenever you push a tag (e.g., `v1.2.3`).

## 🔧 Targets Configuration (`tauri.conf.json`)

Dependencies for Linux builds (if building on Linux):
```bash
sudo apt-get install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```
