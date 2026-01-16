<div align="center">
  <img src="https://raw.githubusercontent.com/Tauri-Apps/tauri/dev/.github/splash.png" alt="TypingPro" width="200" style="border-radius: 20px" />
  <h1>TypingPro Desktop</h1>
  <p>
    <strong>The World's Most Advanced Typing Platform.</strong><br/>
    Built for Speed. Engineered in Rust. Designed with Liquid Glass.
  </p>

  [![Rust](https://img.shields.io/badge/Rust-Core-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org/)
  [![Tauri 2.0](https://img.shields.io/badge/Tauri-v2.0-blue?style=for-the-badge&logo=tauri)](https://tauri.app/)
  [![React](https://img.shields.io/badge/React-TypeScript-cyan?style=for-the-badge&logo=react)](https://react.dev/)
</div>

---

## 🚀 The Ultimate Evolution

TypingPro Desktop is not just a typing test. It is a **focus instrument** designed to push your WPM beyond human limits. By shifting the core engine to **Rust**, we have achieved **sub-millisecond latency**, ensuring that every keystroke is captured with atomic precision.

### ✨ Key Features

- **⚡ Native Turbo Engine**: Core logic rewritten in Rust for zero-latency input processing.
- **💎 Liquid Glass UI**: A stunning, distraction-free interface with native macOS Vibrancy and Windows Blur.
- **🧠 Smart Weakness Tracker**: Uses a local graph to identify your slowest keys and generates custom "Smart Lessons" to target them.
- **👻 Ghost Mode**: Race against your own Personal Best shadow in real-time.
- **🔊 Polyphonic Audio**: Procedural mechanical keyboard sounds (Cherry MX Blue/Brown/Red) with zero delay.
- **🛡️ Anti-Cheat System**: Detecting robotic consistencies (< 2ms deviation) and superhuman bursts.
- **🌗 Auto Contrast Text**: Real-time WCAG 2.1 compliant text color detection over dynamic backgrounds (Powered by Rust).

---

## 🌗 Auto Contrast Text System

TypingPro features a native **Auto Contrast System** that ensures 100% legibility over any background.

- **Rust Backend**: Uses sRGB relative luminance formulas (WCAG 2.1) for high-precision decision making.
- **React Hook**: `useContrastText` provides sub-millisecond switching with a fast YIQ fallback.
- **CSS Tokens**: Integrated with Tailwind via the `text-contrast-text` utility.

---

## 🛠️ Technology Stack

This project uses the latest in web and native performance technology:

- **Frontend**: React 18, TypeScript, TailwindCSS (limited), Custom CSS Glassmorphism.
- **Backend**: Rust (Tauri 2.0), Serde, Window-Vibrancy.
- **State Management**: Zustand (Persisted to LocalStorage).
- **Authentication**: OAuth 2.0 (Google & GitHub) via Tauri Plugin.

---

## 📥 Installation

### macOS

Download the latest `.dmg` from the [Releases Page](https://github.com/typingpro/desktop/releases).
Drag to Applications.

### Windows

Download the `.msi` or `.exe`. Run the installer.

### Linux

AppImage and Deb files available.

---

## 🧑‍💻 Development

To run TypingPro locally:

1. **Clone the repo**

   ```bash
   git clone https://github.com/typingpro/desktop.git
   cd typingpro/apps/desktop
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Dev Mode**

   ```bash
   npm run tauri dev
   ```

---

## 📜 License

MIT License. Built with ❤️ by the TypingPro Team.
