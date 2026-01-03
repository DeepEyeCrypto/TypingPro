# 🦅 Contributing to TypingPro

First off, thanks for taking the time to contribute! TypingPro is a 100% open-source project built by the community, for the community. We value optimization, scientific accuracy, and beautiful UI.

## 🛠 Tech Stack

- **Core**: Tauri v2 (Rust)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Vanilla CSS (Cyberpunk Glassmorphism)
- **State**: Zustand

## 🎨 Theme System Architecture

We use a CSS variable-based theme system. To add a new theme:

1. Open `src/styles/glass.css`
2. Define a new class (e.g., `.theme-solarpunk`)
3. Override the core variables:

```css
.theme-solarpunk {
    --bg-primary: #fdf6e3;
    --glass-surface: rgba(253, 246, 227, 0.4);
    --glass-border: rgba(181, 137, 0, 0.2);
    --text-primary: #586e75;
    --neon-accent: #b58900;
}
```

1. Add your theme to `ThemeType` in `src/stores/settingsStore.ts`

### Glassmorphism Guidelines

- **Surface**: Use `rgba(r, g, b, 0.X)` for backgrounds.
- **Blur**: Standard panels use `backdrop-filter: blur(20px)`.
- **Borders**: 1px solid `rgba(255, 255, 255, 0.1)` (or theme equivalent).

## 🚀 How to Submit a PR

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/TypingPro.git`
3. **Create a branch**: `git checkout -b feature/amazing-feature`
4. **Commit** your changes: `git commit -m 'feat: Add amazing feature'`
5. **Push** to the branch: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## 🧪 Testing

Before submitting, ensure:

- [ ] No console errors
- [ ] TypeScript compiles cleanly (`npm run tsc`)
- [ ] Layout maintains "Zero Scroll" on 1080p screens

Happy Hacking!
