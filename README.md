# TypingPro

<div align="center">
  <img src="public/logo.png" alt="TypingPro Logo" width="120" height="auto" />
  <h1>TypingPro</h1>
  <p><strong>A Modern, Intelligent Typing Tutor for Professionals.</strong></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#development">Development</a> •
    <a href="#building">Building</a> •
    <a href="#license">License</a>
  </p>
</div>

---

**TypingPro** is a sleek, cross-platform desktop application designed to improve your typing speed and accuracy. Built with modern web technologies and wrapped in Electron, it offers a native performance feel with a beautiful, responsive UI.

## ✨ Features

- **🚀 Smart Lessons**: AI-generated typing exercises tailored to your skill level.
- **📊 Real-time Analytics**: Track WPM, accuracy, and error rates instantly as you type.
- **🌙 Dark Mode**: Native dark mode support for late-night practice sessions.
- **🏆 Gamification**: Earn badges and track your progress over time.
- **🎹 Virtual Keyboard**: Visual guide to help learn touch typing without looking down.
- **💻 Cross-Platform**: Optimized builds for **macOS**, **Windows**, and **Linux**.

## 🛠 Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) (Security-hardened)
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/) (Fast HMR & Build)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **State**: React Context API
- **Routing**: React Router (HashRouter)

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DeepEyeCrypto/TypingPro.git
   cd TypingPro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 👨‍💻 Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run electron:dev
```
This command concurrently runs the Vite dev server and the Electron main process.

## 📦 Building

Create production-ready installers for your platform. The build artifacts will be output to the `release/` directory.

### macOS (DMG)
```bash
npm run electron:pack:mac
```

### Windows (EXE/NSIS)
```bash
npm run electron:pack:win
```

### Linux (AppImage & Debian)
```bash
npm run electron:pack:linux
```

## 📂 Project Structure

```
TypingPro/
├── components/       # Reusable React components (Header, Sidebar, Modals)
├── contexts/         # Global State (AppContext)
├── electron-main.cjs # Electron Main Process (System integration)
├── pages/            # Page components (TypingPage)
├── preload.cjs       # Preload script for IPC security
├── public/           # Static assets (Icon, Logo)
└── services/         # Business logic (Gemini AI service)
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <sub>Built with ❤️ by the TypingPro Team.</sub>
</div>
