# MFA Implementation – Single Reference

This is the one-stop overview of how MFA works in MindLogger Admin (replaces older scattered notes).

## What MFA Does
- Prompts users with a TOTP form when the backend returns `mfaRequired`.
- Supports recovery codes as a fallback.
- Shows inline, translated errors; never auto-redirects on failure or expiry.
- Keeps the MFA session alive until the user succeeds or manually goes back to login.

## Architecture Overview

MFA uses **route-based navigation** with dedicated pages:

```
/auth                    → Login page
/auth/verify-mfa         → TOTP verification page
/auth/verify-recovery    → Recovery code page
```

This approach provides:
- Clean browser back/forward navigation
- Proper URL history management
- Session cleanup on login mount (prevents stale session access)

## Key Files

### Routes & Pages
- `src/resources/pages.ts` - Route path definitions (`verifyMFA`, `verifyRecovery`)
- `src/modules/Auth/routes/routes.const.ts` - Route component mappings
- `src/modules/Auth/pages/MFAVerify/index.tsx` - TOTP verification page
- `src/modules/Auth/pages/MFARecovery/index.tsx` - Recovery code page

### Forms & Logic
- `src/modules/Auth/features/Login/MFAForm/MFAForm.tsx` - TOTP input form
- `src/modules/Auth/features/Login/MFAForm/RecoveryCodeForm.tsx` - Recovery code form
- `src/modules/Auth/features/Login/MFAForm/useMFAVerification.ts` - Verification logic hook
- `src/modules/Auth/features/Login/MFAForm/useMFASessionExpiry.ts` - Session expiry handling

### State Management
- `src/modules/Auth/state/Auth.thunk.ts` - Async thunks for MFA verification
- `src/modules/Auth/state/Auth.reducer.ts` - MFA state management
- `src/modules/Auth/state/Auth.state.ts` - Initial state
- `src/modules/Auth/state/Auth.schema.ts` - Type definitions

### Utilities
- `src/modules/Auth/utils/mfa.utils.ts` - Error mapping and formatting

## State Shape (Redux)
```ts
type MFASession = { token: string; sessionId: string; attempts: number; expiresAt: number };
type MFAVerificationState = {
  status: 'idle' | 'loading' | 'error';
  error?: string;
  displayError?: string;  // Formatted error key for UI display
};
type AuthState includes { mfaSession?: MFASession; mfaVerification: MFAVerificationState; ... }
```
- `mfaSession` is created after login if MFA is required and expires after 5 minutes.
- `attempts` increments on failed verification.
- `mfaVerification` holds the last error/status shown to the user.
- `displayError` contains the formatted error key (e.g., `'invalidCode'` or `'invalidCode|2'` with attempts).

## Navigation Flow

### Login → MFA Verification
1. User submits credentials on `/auth`
2. If `mfaRequired` in response, Redux sets `mfaSession`
3. `LoginForm` navigates to `/auth/verify-mfa`

### MFA Verification → Recovery
1. User clicks "Can't access my authenticator app"
2. Page navigates to `/auth/verify-recovery`
3. Browser history now has: `/auth` → `/auth/verify-mfa` → `/auth/verify-recovery`

### Browser Back Button
- From recovery → verification: Uses `navigate(-1)` for clean history
- From verification → login: Route guard redirects (session cleared on login mount)
- Session cleanup on `/auth` mount prevents stale session access via browser navigation

### Route Guards
Both MFA pages include route guards:
```ts
useEffect(() => {
  if (!mfaSession) {
    navigate(page.login, { replace: true });
  }
}, [mfaSession, navigate]);
```

## UI/Flow Rules
- MFA pages show forms when `mfaSession` exists; redirect to login if no session.
- `MFAForm` auto-submits on 6 digits, clears errors when typing, and displays:
  - Error messages from Redux `displayError` field (translated in component).
  - Attempts warning after 3 failed attempts (format: `'invalidCode|2'` → "Invalid code. 2 attempts remaining").
  - Race condition prevention: tracks user typing vs programmatic input changes.
- `RecoveryCodeForm` mirrors this behavior with formatted input (`ABCDE-12345`).
- Session expiry only sets an error; navigation is user-driven via "Back to Login" button.

## Verification Logic (useMFAVerification + thunks)
- Guards against expired `mfaSession` before calling APIs.
- Calls `verifyMFATOTP` or `verifyMFARecoveryCode`; treats responses as success **only** if tokens and user data are present (typed guard).
- On success: store tokens, identify user (Datadog, Mixpanel, feature flags), navigate to library.
- On failure:
  - Redux reducer sets `mfaVerification.error` and computes `displayError` directly.
  - TOTP: Always shows `'invalidCode'`, adds attempt count after 3 failures (`'invalidCode|2'`).
  - Recovery: Shows `'invalidRecoveryCode'` or `'mfaSessionExpired'` based on error message.
  - Increments attempts (TOTP only) and keeps the user on the form.
- Error formatting moved to Redux state to persist through component re-renders.

## API Shape (condensed)
- Login: `POST /auth/login` → either tokens or `{ mfaRequired, mfaToken, mfaSessionId }`.
- TOTP verify: `POST /auth/mfa/totp/verify` with `{ mfaToken, totpCode }` → tokens + user.
- Recovery verify: `POST /auth/mfa/recovery-codes/verify` with `{ mfaToken, code }` → tokens + user.

## Expected Behaviors
- Wrong code: show "Invalid code" inline, stay on MFA page, allow immediate retry.
- Attempts: show remaining attempts after 3rd failure; still stay on MFA page.
- Session expiry: show "MFA session expired", no redirect.
- Recovery codes: same error/expiry behavior; formatted input.
- Manual exit: "Back to Login" clears MFA state and navigates to `/auth`.
- Browser back: Single click navigates smoothly (no blinking, no multiple clicks needed).

## Tests / Checks
- Unit: `useMFAVerification.test.tsx`, `Auth.thunk.test.ts`, form tests.
- Manual scenarios (see `docs/MFA_TEST_SCENARIOS.md`):
  - Invalid code → inline error, no redirect.
  - Expired session → expiry error, no redirect.
  - Multiple failures → attempts warning after 3+.
  - Form switching and recovery code errors work as above.
  - Browser back button navigation works smoothly.

## Recent Changes

### Route-Based Navigation

**Problem**: Browser back button didn't work properly on MFA pages:
- Page blinked, login page flashed briefly
- Multiple clicks required to navigate back from recovery → verification
- No smooth single-click back navigation

**Root Cause**: MFA used client-side state (`AuthFlow` component with `flowState`) instead of URL routing. Browser back button had no awareness of MFA form transitions.

**Solution**: Implemented route-based MFA navigation following the web-refactor pattern:

1. **New Routes Added**:
   - `/auth/verify-mfa` - TOTP verification page
   - `/auth/verify-recovery` - Recovery code page

2. **New Page Components**:
   - `MFAVerify/index.tsx` - Wraps MFAForm with route guard
   - `MFARecovery/index.tsx` - Wraps RecoveryCodeForm with route guard and `navigate(-1)`

3. **Session Cleanup on Login Mount**:
   ```ts
   // In LoginForm.tsx
   useEffect(() => {
     dispatch(auth.actions.clearMFASession());
     dispatch(auth.actions.clearMFAError());
   }, [dispatch]);
   ```
   Prevents stale session access via browser back/forward navigation.

4. **Removed `AuthFlow.tsx`**: No longer needed - routing handles flow transitions.

**Benefits**:
- Browser back/forward works naturally
- Clean URL history management
- Single-click navigation between MFA states
- No page blinking or multiple clicks needed
- Aligned with web-refactor implementation

### Error Display Persistence Fix

**Problem**: Error messages were disappearing due to component re-renders when local state was refreshed.

**Solution**: Moved error formatting logic from component to Redux state:
1. Added `displayError` field to `MFAVerificationState` schema.
2. Redux reducer computes `displayError` when errors occur.
3. Component reads `displayError` directly without transformation.
4. Added `isUserTypingRef` to prevent race conditions when clearing input.

## Quick Troubleshooting
- No error showing? Ensure backend error string matches mappings in `mfa.utils.ts` or add a new pattern.
- Redirected unexpectedly? Check route guards in MFA pages - they redirect to login if no `mfaSession`.
- Success but no tokens? The thunks reject 2xx responses that lack tokens/user; check API response shape.
- Error disappears on re-render? Check that `displayError` is set in Redux state, not local state.
- Browser back not working? Ensure routes are properly configured in `routes.const.ts` and `pages.ts`.
- Multiple clicks needed? Check that recovery page uses `navigate(-1)` for back button, not explicit route.
