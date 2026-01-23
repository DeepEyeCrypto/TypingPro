# Final Deployment Checklist: v1.2.1 Hotfix

Ensure every step below is checked before shipping to production.

## 1. Technical Validation

- [ ] **Build Success**: `npm run build` in `apps/desktop` completes without errors.
- [ ] **Code Audit**: `useAuth.ts` contains the `try...catch` block around `onDeepLinkOpenUrl`.
- [ ] **Performance Audit**: `App.tsx` triggers `setIsLoading(false)` within 1 second.
- [ ] **Console Inspection**: No `TypeError` messages appear in the browser console during startup.

## 2. Functional Testing

- [ ] **App Launch**: App starts and transitions to Dashboard.
- [ ] **Authentication**: OAuth flow (Google/GitHub) still initiates correctly.
- [ ] **Data Integrity**: User profile and stats load correctly in the background.
- [ ] **Social Features**: Friends and duel listenings initialize without blocking UI.

## 3. Deployment Preparation

- [ ] **Version Bump**: Check if `package.json` needs a version sync to `1.2.59` or similar.
- [ ] **Environment Variables**: Verify `.env.production` has correct Firebase and OAuth keys.
- [ ] **Asset Check**: Ensure no missing images or icons in the production build.

## 4. Release Process

- [ ] **Commit**: All changes committed with clear messages (see `GIT_COMMIT_GUIDE.md`).
- [ ] **Tag**: Git tag `v1.2.1` applied to the commit.
- [ ] **GitHub Release**: Draft created with the generated walkthrough.
- [ ] **Artifacts**: `.dmg` or `.app` generated and ready for distribution.

---
**Status**: [READY FOR DEPLOYMENT]
