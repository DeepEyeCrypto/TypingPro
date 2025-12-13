# TypingPro Build Guide

## Overview
TypingPro uses Tauri + Vite + React. This guide covers how to build for macOS, Windows, and Linux.

## Quick Start
To increment the version (patch) and build for all configured targets:

```bash
npm run tauri:build:all
```

This command will:
1. Bump the version in `package.json`.
2. Sync the version to `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.
3. Run `tauri build` for the specified targets:
   - macOS: `x86_64-apple-darwin`, `aarch64-apple-darwin`
   - Windows: `x86_64-pc-windows-nsis` (requires setup, see below)
   - Linux: `x86_64-unknown-linux-gnu` (requires setup, see below)

## Output Locations
- **macOS**: `src-tauri/target/release/bundle/dmg/` and `src-tauri/target/release/bundle/macos/`
- **Windows**: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/` (or similar depending on cross-compile target)
- **Linux**: `src-tauri/target/unknown-linux-gnu/release/bundle/deb/` and `appimage/`

## Cross-Compilation Setup from macOS

> [!IMPORTANT]
> Cross-compiling for Windows and Linux from macOS has significant limitations and requirements.

### 1. Rust Targets
You must add the target architectures to your Rust toolchain:

```bash
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin
rustup target add x86_64-pc-windows-msvc
rustup target add x86_64-unknown-linux-gnu
```

### 2. Windows Build on macOS
To build a Windows NSIS installer on macOS, you need `nsis`:

```bash
brew install nsis
```

**Note**: Building for `x86_64-pc-windows-msvc` requires MSVC libraries which are not redistributable on macOS. You might need to use `x86_64-pc-windows-gnu` instead or use a Windows machine/CI.

If using `gnu` target:
```bash
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
```
And update the build command target to `x86_64-pc-windows-gnu`.

### 3. Linux Build on macOS
Building for Linux on macOS is **highly experimental** and often fails due to linking against system libraries (glibc, GTK, webkit2gtk) that are not present or binary-compatible on macOS.

**Recommended Approach:** Use Docker.
Run the build inside a Linux container that has all the build prerequisites.

```bash
# Example using tauri-build docker image (conceptual)
docker run --rm -v $(pwd):/app -w /app dfrg/tauri-build:latest npm run tauri:build
```

**Alternative**: Use GitHub Actions to build automatically on push.
