# TypingPro Onboarding: Environment & Secrets 🛡️

## 1. Local Development Setup

1. Copy `.env.example` to `.env.local` in the root directory.
2. Go to [Firebase Console](https://console.firebase.google.com/) -> Project Settings.
3. Scroll down to "Your apps" and copy the Firebase configuration object.
4. Paste the values into your `.env.local`:
   - `apiKey` -> `VITE_FIREBASE_API_KEY`
   - `authDomain` -> `VITE_FIREBASE_AUTH_DOMAIN`
   - ...and so on.
5. (Optional) For high-frequency testing, enable Firebase emulators and set `VITE_FIREBASE_EMULATOR_ENABLED=true`.

## 2. Production Build Setup

If you are building locally for production, create a `.env.production` file (do not commit it). The `scripts/check-env.cjs --env=production` guard will verify this before building.

## 3. GitHub Actions (Remote Release)

To ensure the automated release pipeline succeeds, you MUST provision the following **Repository Secrets**:

- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_APP_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`

> [!IMPORTANT]
> The CI workflow will fail immediately if any of these secrets are missing or empty. This is an intentional safety feature to prevent shipping non-functional builds.
