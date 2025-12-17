<div align="center">
  <img src="public/logo.png" alt="TypingPro Logo" width="120" height="auto" />
  <h1>TypingPro</h1>
  <p><strong>The Professional, Privacy-Focused Typing Master.</strong></p>

  <p>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/releases">
      <img src="https://img.shields.io/github/v/release/DeepEyeCrypto/TypingPro?style=flat-square&color=blue&label=Latest%20Release" alt="Latest Release" />
    </a>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/DeepEyeCrypto/TypingPro/release.yml?style=flat-square&label=Build" alt="Build Status" />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/Stack-Tauri%20%2B%20React%2019-orange?style=flat-square" alt="Tech Stack" />
    </a>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
    </a>
  </p>

  <p>
    <a href="#key-features">Features</a> •
    <a href="#downloads">Downloads</a> •
    <a href="#installation">Installation</a> •
    <a href="#development">Development</a>
  </p>
</div>

---

**TypingPro** is a modern, high-performance typing tutor app designed for speed, focus, and aesthetics. Built with **Tauri (Rust)** and **React 19**, it delivers a native desktop experience with 60FPS animations and zero latency. Whether you're a developer optimizing your workflow or a student learning to touch type, TypingPro adapts to your skill level.

## 🌟 Key Features

### 🎯 **Professional Training**
- **Adaptive Lessons**: Curriculum ranging from home row basics to complex programming syntax.
- **Real-Time Analytics**: Instant tracking of WPM, Accuracy, and Error Heatmaps.
- **Smart Hands Overlay**: Animated hand guides that teach correct finger placement in real-time.

### 🎥 **Cinematic Video Player**
- **Glassmorphism UI**: Beautiful, responsive video player with liquid glass controls.
- **HLS Streaming**: Instant playback with zero buffering using `hls.js`.
- **Focus Mode**: Fullscreen support and distraction-free viewing.

### 🎨 **Modern Experience**
- **Deep Customization**: Adjust fonts (Cinzel, Sans), sizes, and cursor styles (Block, Line, Underline).
- **High Contrast**: Optimized color themes for maximum legibility.
- **Offline First**: Fully functional without an internet connection.

## 📥 Downloads

Download the latest version for your OS from the [Releases Page](https://github.com/DeepEyeCrypto/TypingPro/releases).

| Platform | Installer | Architecture |
|----------|-----------|--------------|
| **macOS** | `.dmg` | Universal (Apple Silicon & Intel) |
| **Windows** | `.exe` / `.msi` | x64 |
| **Linux** | `.deb` / `.AppImage` | x64 |

## 🛠 Technology Stack

- **Core**: Tauri (Rust)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (v3), Glassmorphism Utils
- **Media**: HLS.js, Custom Video Controls
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions (Cross-platform Release Pipeline)

## 💻 Installation (For Developers)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/DeepEyeCrypto/TypingPro.git
    cd TypingPro
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # Ensure you have Rust installed via rustup
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    # Starts the Vite dev server and Tauri window
    ```

## 📦 Building & Release

We use a **Strict Version Sync** pipeline to ensure artifacts always match the package version.

### Key Commands

| Command | Description |
|---------|-------------|
| `npm run build:all` | **Build & Package**: Runs sync -> clean -> frontend -> desktop (Universal DMG). |
| `npm run release:all` | **Full Release**: Bumps version -> Syncs -> Builds -> Tags Git -> Pushes. |
| `npm run sync-version` | **Verify Sync**: Checks if `package.json` and `tauri.conf.json` match. |

### CI/CD Pipeline
Our GitHub Actions workflow automatically:
1.  **Syncs Versions**: Runs `scripts/force-sync.js` to prevent version mismatch.
2.  **Cleans Environment**: Removes stale artifacts.
3.  **Builds Universal**: Generates optimized binaries for all platforms.
4.  **Publishes**: Uploads assets to GitHub Releases.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <sub>Built with ❤️ by the DeepEyeCrypto Team</sub>
</div>
