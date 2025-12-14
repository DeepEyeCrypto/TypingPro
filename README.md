
<div align="center">
  <img src="public/logo.png" alt="TypingPro Logo" width="120" height="auto" />
  <h1>TypingPro</h1>
  <p><strong>The Ultimate Open-Source Typing Master.</strong></p>

  <p>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/releases">
      <img src="https://img.shields.io/github/v/release/DeepEyeCrypto/TypingPro?style=flat-square&color=blue" alt="Latest Release" />
    </a>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/Stack-Tauri%20%2B%20React-orange?style=flat-square" alt="Tech Stack" />
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

**TypingPro** is a modern, privacy-focused typing tutor designed for speed and focus. Built with **Tauri** and **React**, it offers a native performance feel with a web-like development experience. Whether you're a developer looking to boost your WPM or a beginner starting from scratch, TypingPro provides the tools you need in a beautiful, distraction-free package.

## 🌟 Key Features

### 🎯 **Smart Training**
- **Dynamic Lessons**: From home row basics to advanced code snippets.
- **Real-Time Analytics**: Instant feedback on WPM, accuracy, and error heatmaps.
- **Smart Hands Overlay**: A realistic, animated hand guide that shows exactly which finger to use.

### 🎨 **Deep Customization**
- **Visual Preferences**: Choose your font (Cinzel, customized sans-serif), size (A+ Medium), and cursor style (Underline, Block, Line).
- **High Contrast Mode**: Default **Bright Yellow** text on dark backgrounds for maximum readability.
- **Focus Mode**: "Stop on Error" disabled by default for smoother flow (toggleable).

### 🚀 **Performance & Offline**
- **Native Speed**: Built on Rust, the app launches instantly and uses minimal RAM.
- **Offline First**: No internet required. All assets, including high-quality video tutorials, are bundled locally.
- **Optimized Assets**: Compressed video tutorials for instant playback without buffering.

### 🎥 **Interactive Tutorials**
- Integrated video lessons for proper posture and technique.
- Visual keyboard mapping for every key press.

## 📥 Downloads

Download the latest version for your OS from the [Releases Page](https://github.com/DeepEyeCrypto/TypingPro/releases).

| Platform | Installer Type |
|----------|---------------|
| **macOS** | `.dmg` (Intel & Apple Silicon) |
| **Windows** | `.exe` / `.msi` |
| **Linux** | `.deb` / `.AppImage` |

## 🛠 Technology Stack

- **Core**: Tauri (Rust)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build System**: GitHub Actions (Cross-platform CI)

## 💻 Installation (For Developers)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/DeepEyeCrypto/TypingPro.git
    cd TypingPro
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    # This starts the React dev server and the Tauri window
    ```

## 📦 Building

We use a unified build script. See [BUILD.md](BUILD.md) for detailed prerequisites and artifact details.

```bash
# Build for all valid targets on current OS
npm run build:all
```

**Note on CI/CD**:
We utilize **GitHub Actions** to build native binaries for Windows (.exe), Linux (.deb), and macOS (.dmg) automatically on every release tag.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <sub>Built with ❤️ by the TypingPro Team</sub>
</div>
