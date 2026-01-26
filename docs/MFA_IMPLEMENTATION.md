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

### State Management
- `src/modules/Auth/state/Auth.thunk.ts` - Async thunks for MFA verification
- `src/modules/Auth/state/Auth.reducer.ts` - MFA state management
- `src/modules/Auth/state/Auth.state.ts` - Initial state
- `src/modules/Auth/state/Auth.schema.ts` - Type definitions

### Utilities
- `src/modules/Auth/utils/mfa.utils.ts` - Error mapping and formatting

## State Shape (Redux)
```ts
type MFASession = { token: string; sessionId: string };

type MFAVerificationState = {
  status: 'idle' | 'loading' | 'error';
  displayError?: string;    
  attemptsRemaining?: number; 
};

type AuthState includes {
  mfaSession?: MFASession;
  totpVerification: MFAVerificationState;      // TOTP-specific errors
  recoveryVerification: MFAVerificationState;  // Recovery-specific errors
  isSessionExpired: boolean;                   // Shared terminal state from backend
  ...
}
```
- `mfaSession` is created after login if MFA is required (backend controls expiry).
- `attemptsRemaining` comes from backend API error response metadata.
- `isSessionExpired` is set when backend returns session expiry error.
- Separate verification states prevent errors from persisting when switching forms.

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
  - Attempts warning when backend returns `attemptsRemaining` ≤ 3 (format: `'invalidCode|2'` → "Invalid code. 2 attempts remaining").
  - Race condition prevention: tracks user typing vs programmatic input changes.
- `RecoveryCodeForm` mirrors this behavior with formatted input (`ABCDE-12345`).
- Session expiry is detected via backend error response; navigation is user-driven via "Back to Login" button.
- Errors are cleared when switching between TOTP and Recovery forms (including browser back/forward).

## Verification Logic (useMFAVerification + thunks)
- Calls `verifyMFATOTP` or `verifyMFARecoveryCode`; treats responses as success **only** if tokens and user data are present (typed guard).
- On success: store tokens, identify user (Datadog, Mixpanel, feature flags), navigate to library.
- On failure (backend-driven error handling):
  - Backend returns `error_code` and `metadata.session_attempts_remaining` in error response.
  - `getMfaErrorResult()` maps backend error codes to translation keys.
  - Redux reducer sets `displayError` in the appropriate verification state (TOTP or Recovery).
  - If `attemptsRemaining` ≤ 3, error format includes count: `'invalidCode|2'`.
  - Session expiry errors set `isSessionExpired` flag (terminal state).
- Error formatting moved to Redux state to persist through component re-renders.
- Separate states for TOTP and Recovery prevent error bleeding when switching forms.

## API Shape (condensed)
- Login: `POST /auth/login` → either tokens or `{ mfaRequired, mfaToken, mfaSessionId }`.
- TOTP verify: `POST /auth/mfa/totp/verify` with `{ mfaToken, totpCode }` → tokens + user.
- Recovery verify: `POST /auth/mfa/recovery-codes/verify` with `{ mfaToken, code }` → tokens + user.

## Expected Behaviors
- Wrong code: show "Invalid code" inline, stay on MFA page, allow immediate retry.
- Attempts: show remaining attempts when backend returns `attemptsRemaining` ≤ 3.
- Session expiry: show "MFA session expired" when backend returns expiry error, no redirect.
- Recovery codes: same error/expiry behavior; formatted input.
- Form switching: errors cleared when switching between TOTP and Recovery (prevents stale errors).
- Manual exit: "Back to Login" clears MFA state and navigates to `/auth`.
- Browser back: Single click navigates smoothly (no blinking, no multiple clicks needed).

## Tests / Checks
- Unit: `useMFAVerification.test.tsx`, `Auth.thunk.test.ts`, `mfa.utils.test.ts`, form tests.
- Manual scenarios:
  - Invalid code → inline error, no redirect.
  - Session expiry (from backend) → expiry error, no redirect.
  - Multiple failures → attempts warning when backend returns `attemptsRemaining` ≤ 3.
  - Switch between TOTP and Recovery → previous errors cleared.
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

### Backend-Driven Error Handling

**Problem**: Client-side session and attempt tracking duplicated backend logic:
- `MFASession` had `attempts` and `expiresAt` fields tracked locally
- `useMFASessionExpiry` hook ran client-side timer for session expiry
- Single shared error state caused errors to persist when switching between TOTP and Recovery forms

**Solution**: Backend is now the single source of truth:

1. **Removed client-side tracking**:
   - `MFASession` now only contains `token` and `sessionId`
   - Deleted `useMFASessionExpiry.ts` (no client-side timer)
   - Removed `isMFASessionExpired()` utility

2. **Backend-driven errors**:
   - `attemptsRemaining` comes from API error response metadata
   - `isSessionExpired` flag set when backend returns expiry error
   - Error codes mapped via `getMfaErrorResult()` in `mfa.utils.ts`

3. **Separate error states**:
   - `totpVerification` and `recoveryVerification` are independent Redux states
   - Errors cleared when switching forms (UI click or browser back/forward)
   - Prevents error bleeding between TOTP and Recovery forms

**Benefits**:
- Single source of truth (backend controls session/attempts)
- No client/server sync issues
- Simpler client code
- Backend can change limits without client updates

## Quick Troubleshooting
- No error showing? Ensure backend error string matches mappings in `mfa.utils.ts` or add a new pattern.
- Redirected unexpectedly? Check route guards in MFA pages - they redirect to login if no `mfaSession`.
- Success but no tokens? The thunks reject 2xx responses that lack tokens/user; check API response shape.
- Error disappears on re-render? Check that `displayError` is set in Redux state, not local state.
- Browser back not working? Ensure routes are properly configured in `routes.const.ts` and `pages.ts`.
- Multiple clicks needed? Check that recovery page uses `navigate(-1)` for back button, not explicit route.
