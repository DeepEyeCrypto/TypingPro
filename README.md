
<div align="center">
  <img src="public/logo.png" alt="TypingPro Logo" width="120" height="auto" />
  <h1>TypingPro</h1>
  <p><strong>The Final Word in Professional Typing Tutors.</strong></p>

  <p>
    <a href="https://github.com/DeepEyeCrypto/TypingPro/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="TypingPro is released under the MIT license." />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white" alt="Built with React 19" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript&logoColor=white" alt="Built with TypeScript" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite&logoColor=white" alt="Built with Vite" />
    </a>
    <a href="https://tauri.app/">
      <img src="https://img.shields.io/badge/Tauri-1.6-ffc131.svg?logo=tauri&logoColor=black" alt="Built with Tauri" />
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#building">Building</a> •
    <a href="#license">License</a>
  </p>
</div>

---

**TypingPro** is an elegant, high-performance desktop application engineered to transform the way you type. By combining AI-driven lessons with a distraction-free, native environment, TypingPro offers a seamless path to mastery for developers, writers, and professionals.

## ✨ Features

- **🚀 Smart AI Lessons**: Dynamic exercises that adapt to your skill level.
- **✋ Geometric Hand Overlay**: A custom, beautiful visual guide with dynamic finger highlighting.
- **🎥 Video Tutorials**: Integrated instructional videos to master touch-typing fundamentals.
- **📊 Real-Time Analytics**: Instant feedback on WPM, accuracy, and error heatmaps.
- **🌙 True Dark Mode**: A carefully crafted dark theme that's easy on the eyes.
- **🏆 Gamification System**: Earn badges and achievements as you hit new milestones.
- **⚡️ Native Performance**: Built with **Tauri** (Rust) and **Vite** for <10MB installers and instant startup.

## 🛠 Technology Stack

TypingPro is built on a cutting-edge stack designed for performance and maintainability:

| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | [Tauri](https://tauri.app/) | Ultra-lightweight cross-platform runtime (Rust) |
| **UI Library** | [React 19](https://react.dev/) | The latest in component-based UI |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe code for reliability |
| **Bundler** | [Vite](https://vitejs.dev/) | Lightning-fast HMR and build speeds |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, responsive design |

## 📥 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/DeepEyeCrypto/TypingPro.git
    cd TypingPro
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development**:
    ```bash
    npm run dev
    ```

## 📦 Building & Releasing

We use a unified build system to generate production-ready installers for all platforms.

### Build All Targets
To build for macOS (Intel & Apple Silicon), Windows, and Linux in one go:

```bash
npm run build:all
```

**Artifacts** will be generated in the `release/` folder:
- `release/TypingPro_x.x.x_x64.dmg` (macOS Intel)
- `release/TypingPro_x.x.x_aarch64.dmg` (macOS M1/M2)
- `release/TypingPro_x.x.x_x64_en-US.msi` (Windows - requires MSVC on host)
- `release/TypingPro_x.x.x_amd64.deb` (Linux - requires gtk libs on host)

> **Note**: Cross-compilation (e.g. building Windows apps on macOS) requires specific toolchains. If `npm run build:all` fails for a specific platform, it will skip it and produce the others.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Designed & Built by the TypingPro Team.</sub>
</div>
