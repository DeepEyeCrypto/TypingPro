# Google OAuth Setup Instructions

Follow these steps to configure Google OAuth for TypingPro:

1. **Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **OAuth Consent Screen**:
   - Navigate to **APIs & Services > OAuth consent screen**.
   - Choose **External** user type.
   - Fill in app information (App name: TypingPro, User support email, Developer contact info).
   - Add the `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.

3. **Create Credentials**:
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ Create Credentials > OAuth client ID**.
   - Application type: **Web application**.
   - Name: `TypingPro Dev`.
   - Authorized JavaScript origins:
     - `http://localhost:1420`
   - Authorized redirect URIs:
     - `http://localhost:1420/auth/callback`
   - Click **Create**.

4. **Update Environment**:
   - Copy the **Client ID** to `VITE_GOOGLE_CLIENT_ID` in your `.env.local`.
   - Ensure `VITE_GOOGLE_REDIRECT_URI` matches the one configured above.
