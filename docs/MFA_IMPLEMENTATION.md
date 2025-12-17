# MFA Implementation – Single Reference

This is the one-stop overview of how MFA works in MindLogger Admin (replaces older scattered notes).

## What MFA Does
- Prompts users with a TOTP form when the backend returns `mfaRequired`.
- Supports recovery codes as a fallback.
- Shows inline, translated errors; never auto-redirects on failure or expiry.
- Keeps the MFA session alive until the user succeeds or manually goes back to login.

## Key Files
- Flow: `AuthFlow.tsx`
- Forms: `MFAForm.tsx`, `RecoveryCodeForm.tsx`
- Logic: `useMFAVerification.ts`, `useMFASessionExpiry.ts`
- State: `Auth.thunk.ts`, `Auth.reducer.ts`, `Auth.state.ts`, `Auth.schema.ts`
- Error mapping: `modules/Auth/utils/mfa.utils.ts`

## State Shape (Redux)
```ts
type MFASession = { token: string; sessionId: string; attempts: number; expiresAt: number };
type MFAVerificationState = { status: 'idle' | 'loading' | 'error'; error?: string };
type AuthState includes { mfaSession?: MFASession; mfaVerification: MFAVerificationState; ... }
```
- `mfaSession` is created after login if MFA is required and expires after 5 minutes.
- `attempts` increments on failed verification.
- `mfaVerification` holds the last error/status shown to the user.

## UI/Flow Rules
- `AuthFlow` shows MFA forms whenever `mfaSession` exists, and stays on MFA even if the session expires (no silent redirect). A “Back to Login” link lets the user clear MFA and return.
- `MFAForm` auto-submits on 6 digits, clears errors when typing, and displays:
  - Translated server error (e.g., “Invalid code”).
  - Attempts warning after 3 failed attempts (`attemptsRemaining`).
- `RecoveryCodeForm` mirrors this behavior with formatted input (`ABCDE-12345`).
- Session expiry only sets an error; navigation is user-driven.

## Verification Logic (useMFAVerification + thunks)
- Guards against expired `mfaSession` before calling APIs.
- Calls `verifyMFATOTP` or `verifyMFARecoveryCode`; treats responses as success **only** if tokens and user data are present (typed guard).
- On success: store tokens, identify user (Datadog, Mixpanel, feature flags), navigate to library.
- On failure: dispatches `mfaVerification.error`, increments attempts (TOTP), and keeps the user on the form.
- Error messages are mapped through `getMFAError` to friendly translations (`invalidCode`, `invalidRecoveryCode`, `mfaSessionExpired`, `tooManyAttempts`).

## API Shape (condensed)
- Login: `POST /auth/login` → either tokens or `{ mfaRequired, mfaToken, mfaSessionId }`.
- TOTP verify: `POST /auth/mfa/totp/verify` with `{ mfaToken, totpCode }` → tokens + user.
- Recovery verify: `POST /auth/mfa/recovery-codes/verify` with `{ mfaToken, code }` → tokens + user.

## Expected Behaviors
- Wrong code: show “Invalid code” inline, stay on MFA, allow immediate retry.
- Attempts: show remaining attempts after 3rd failure; still stay on MFA.
- Session expiry: show “MFA session expired”, no redirect.
- Recovery codes: same error/expiry behavior; formatted input.
- Manual exit: “Back to Login” clears MFA state and returns to login.

## Tests / Checks
- Unit: `useMFAVerification.test.tsx`, `Auth.thunk.test.ts`, form tests.
- Manual scenarios (see `docs/MFA_TEST_SCENARIOS.md`):
  - Invalid code → inline error, no redirect.
  - Expired session → expiry error, no redirect.
  - Multiple failures → attempts warning after 3+.
  - Form switching and recovery code errors work as above.

## Quick Troubleshooting
- No error showing? Ensure backend error string matches mappings in `mfa.utils.ts` or add a new pattern.
- Redirects on failure? Verify `AuthFlow` still holds MFA when `hasHadMFASession` is true and thunks reject malformed responses.
- Success but no tokens? The thunks now reject 2xx responses that lack tokens/user; check API response shape.
