# Release Workflow Guide

## Prerequisites
Before running a release, ensure you have:
1.  **Node.js & Rust** installed locally.
2.  **GitHub Secrets** configured (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

## One-Command Release
To release a new version (Verify Local Build -> Bump Version -> Tag -> Push -> CI Build):

```bash
npm run release:all
```

This command will:
1.  **Verify Locally**: Runs `npm run build:all` (requirements check + frontend build + local desktop build).
    *   *If this fails locally, the release stops.*
2.  **Bump Version**: Increment `package.json` version (patch).
3.  **Push to GitHub**: Pushes the new commit and tag `vX.Y.Z`, triggering the cloud build.

## Individual Commands
-   `npm run build:all` - Verify builds on your local machine only.
-   `npm run build:frontend` - Fast check if React app compiles.
-   `npm run build:desktop` - Build native app for your current OS.


## CI/CD Pipeline
Once pushed, **GitHub Actions** takes over:
-   **MacOS**: Builds `TypingPro_..._universal.dmg` (Intel + Apple Silicon).
-   **Windows**: Builds `TypingPro_..._x64-setup.exe`.
-   **Linux**: Builds `.deb` and `.AppImage`.

All artifacts are automatically attached to the **GitHub Release** draft.
