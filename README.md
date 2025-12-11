
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
    <a href="https://www.electronjs.org/">
      <img src="https://img.shields.io/badge/Electron-29-47848f.svg?logo=electron&logoColor=white" alt="Built with Electron" />
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

- **🚀 Smart AI Lessons**: Dynamic exercises that adapt to your skill level, ensuring constant progression.
- **🎥 Video Tutorials**: Integrated instructional videos to master touch-typing fundamentals.
- **🔄 Auto-Updates**: Seamless background updates ensure you're always on the latest version.
- **📊 Real-Time Analytics**: Instant feedback on WPM, accuracy, and error heatmaps.
- **🌙 True Dark Mode**: A carefully crafted dark theme that's easy on the eyes during late-night sessions.
- **🏆 Gamification System**: Earn badges and achievements as you hit new milestones.
- **⌨️ Virtual Keyboard**: A visual guide to perfect your finger placement without looking down.
- **⚡️ Native Performance**: Built with Electron and Vite for zero-latency typing and instant startup.

## 🛠 Technology Stack

TypingPro is built on a cutting-edge stack designed for performance and maintainability:

| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | [Electron](https://www.electronjs.org/) | Cross-platform desktop runtime |
| **UI Library** | [React 19](https://react.dev/) | The latest in component-based UI |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe code for reliability |
| **Bundler** | [Vite](https://vitejs.dev/) | Lightning-fast HMR and build speeds |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, responsive design |
| **State** | React Context | Lightweight global state management |

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
    npm run electron:dev
    ```

## 📦 Building & Releasing

To create production-ready installers:

### macOS (DMG)
```bash
npm run build:mac
```

### Windows (EXE)
```bash
npm run build:win
```

### Linux (AppImage)
```bash
npm run build:linux
```

> **Note**: For Auto-Updates to work, you must set `GH_TOKEN` in your environment variables when building/publishing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Designed & Built by the TypingPro Team.</sub>
</div>
