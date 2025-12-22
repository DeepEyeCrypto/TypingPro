# TypingPro OAuth Authentication Docs

## Env Flow
The environment variables flow from the `.env` file at the root to both the Frontend (Vite) and Backend (Rust).

1.  **Backend (Rust)**:
    -   Rust reads `.env` directly using the `dotenv` crate.
    -   It uses `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`.
    -   These secrets are kept strictly on the backend and never exposed to the frontend.
2.  **Frontend (Vite/React)**:
    -   Vite picks up variables prefixed with `VITE_`.
    -   In React, these are accessed via `import.meta.env.VITE_GOOGLE_CLIENT_ID`, etc.
    -   Vite injects these values during build/dev time.

## How to Restart Correctly
Any time you change the `.env` file, you MUST perform these steps to ensure the changes are picked up by both Rust and Vite:

1.  **Stop the dev server**: Press `Ctrl+C` in your terminal.
2.  **Clear Vite cache (Optional but recommended)**:
    ```bash
    rm -rf node_modules/.vite
    ```
3.  **Restart the app**:
    ```bash
    cargo tauri dev
    ```

## System Health Panel
The login modal contains a "System Health" panel. If anything is marked as `[FAIL]`, check your `.env` file and ensure all keys are present. The exact missing variable will be logged in the Rust terminal and shown in the health panel.
