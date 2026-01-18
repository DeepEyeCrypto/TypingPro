# Google OAuth Setup for TypingPro (Tauri Desktop App)

This guide walks you through setting up Google OAuth for the TypingPro desktop application using Tauri's deep-link based authentication flow.

---

## Prerequisites

- Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top → **New Project**
3. Enter project details:
   - **Project name**: `TypingPro`
   - **Organization**: Leave as default
4. Click **Create**
5. Wait for the project to be created, then select it

---

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type → Click **Create**
3. Fill in the App Information:
   - **App name**: `TypingPro`
   - **User support email**: Your email
   - **App logo**: (Optional) Upload the TypingPro logo
4. **Developer contact information**: Your email
5. Click **Save and Continue**

### Scopes Configuration

1. Click **Add or Remove Scopes**
2. Find and select these scopes:
   - `.../auth/userinfo.email` - See your primary Google Account email address
   - `.../auth/userinfo.profile` - See your personal info
   - `openid` - Associate you with your personal info on Google
3. Click **Update** → **Save and Continue**

### Test Users (Development Only)

1. Click **Add Users**
2. Add your Google email address
3. Click **Save and Continue** → **Back to Dashboard**

---

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Configure:
   - **Application type**: `Web application`
   - **Name**: `TypingPro Desktop`

### ⚠️ IMPORTANT: Redirect URIs for Tauri Deep Links

Since TypingPro uses Tauri's deep-link protocol (`typingpro://`), you need to configure:

**Authorized JavaScript origins:**

```
http://localhost:1420
```

**Authorized redirect URIs:**

```
typingpro://auth/callback
```

> **Note**: Google allows custom URI schemes like `typingpro://` for native/desktop applications.

1. Click **Create**

---

## Step 4: Copy Your Credentials

After creating, you'll see a popup with:

- **Client ID**: `xxxxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxx`

**Save these somewhere secure!**

---

## Step 5: Configure TypingPro

### Option A: Environment Variables (Recommended for Dev)

Create a `.env.local` file in `apps/desktop/`:

```bash
# apps/desktop/.env.local
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=typingpro://auth/callback
```

### Option B: System Environment Variables (Required for Rust Backend)

The Rust backend reads credentials from system environment variables:

**macOS/Linux** (add to `~/.zshrc` or `~/.bashrc`):

```bash
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export TAURI_GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
```

**Windows** (PowerShell):

```powershell
$env:GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
$env:TAURI_GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
```

After setting, restart your terminal and run:

```bash
source ~/.zshrc  # macOS/Linux only
```

---

## Step 6: Test the Integration

1. Start the development server:

   ```bash
   cd apps/desktop
   npm run tauri dev
   ```

2. Click the **Google login button** in the TopBar

3. A system browser should open with the Google sign-in page

4. After signing in, the app should receive the callback via `typingpro://auth/callback`

5. You should see:
   - A toast notification: "Welcome back, {Your Name}!"
   - Your avatar in the TopBar

---

## Troubleshooting

### "Missing Client ID" Error

- Ensure `GOOGLE_CLIENT_ID` is set in your system environment
- Restart your terminal after setting env vars
- Check if the variable is accessible: `echo $GOOGLE_CLIENT_ID`

### "Invalid Redirect URI" Error

- Verify `typingpro://auth/callback` is in your Google Console redirect URIs
- The URI must match **exactly** (case-sensitive)

### Deep Link Not Working

- Ensure Tauri's deep-link plugin is properly configured in `tauri.conf.json`
- Check that the app is registered as a handler for `typingpro://` protocol
- On macOS, you may need to **rebuild** the app for protocol registration

### "Access Denied" Error

- Your Google account must be added as a test user in OAuth consent screen
- Make sure you're signed in with the correct Google account

---

## Production Deployment

Before publishing to production:

1. **Publish your OAuth consent screen** (move from Testing to Production)
2. **Submit for verification** if you have sensitive scopes
3. **Use environment-specific credentials** (separate dev/prod Client IDs)
4. **Never commit secrets** to version control

---

## Security Checklist

- [x] Client Secret stored in environment variable, not in code
- [x] Using PKCE (Proof Key for Code Exchange) for security
- [x] Redirect URI uses custom scheme (`typingpro://`)
- [x] `.env.local` is in `.gitignore`
