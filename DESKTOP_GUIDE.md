# TypingPro Desktop (Tauri)

This project has been converted from Electron to [Tauri](https://tauri.app/) for a lighter, faster, native desktop experience.

## Prerequisites

You must have Rust and Cargo installed to build the native application.
To install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

## Development

Run the following command to start the frontend and the native desktop window in development mode:

```bash
npm run tauri dev
```

## Building for Production

To create an optimized native installer for your platform (macOS .dmg, Windows .msi, Linux .deb/.AppImage):

```bash
npm run tauri build
```

The artifacts will be output to `src-tauri/target/release/bundle/`.

## Project Structure

- `src/`: React Frontend (Vite)
- `src-tauri/`: Native Rust Shell
  - `tauri.conf.json`: Main Configuration (Icons, Window size, Permissions)
  - `Cargo.toml`: Rust dependencies
