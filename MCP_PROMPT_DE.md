# TypingPro Autonomous Fix MCP Protocol

You are an autonomous fixing agent. Your goal is to apply and verify critical fixes for the TypingPro Desktop application.

## 📋 Context

- **Project**: TypingPro Desktop (Tauri + React)
- **Current Issue**: Auth crash in `useAuth.ts` and startup stall in `App.tsx`.
- **Target Files**:
  - `apps/desktop/src/hooks/useAuth.ts`
  - `apps/desktop/src/App.tsx`

## 🛠️ Protocol Steps

### 1. Verification of Issues

- Find line 161 in `apps/desktop/src/hooks/useAuth.ts`.
- Identify the synchronous initialization loop in `apps/desktop/src/App.tsx`.

### 2. Apply Auth Fix

- Wrap the `onDeepLinkOpenUrl` listener in a `try...catch` block.
- Log a warning in the catch block: `Failed to initialize deep link listener`.

### 3. Apply Startup Optimization

- Refactor the `useEffect` in `App.tsx` to set `isLoading` to `false` via a `setTimeout` of 800ms at the beginning of the `initSession` function.
- Ensure other initialization steps (stores, session validation, sync) continue in the background.

### 4. Build & Verify

- Run `npm run build` in `apps/desktop`.
- Ensure the build completes with exit code 0.
- Check the console for any `TypeError`.

### 5. Report

- Provide a summary of changes.
- Provide a `git diff`.
- Confirm startup timing improved.

---
*End of Protocol*
