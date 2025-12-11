# MFA Integration Overview

## Quick Start

MFA is automatically triggered when a user with MFA enabled logs in. The flow is handled by the `AuthFlow` component which conditionally renders login or MFA forms.

## Integration Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  LoginForm  │────▶│   Backend   │────▶│   AuthFlow  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │ credentials        │ mfaRequired?       │
       └───────────────────▶│                    │
                           │                    │
                           ├─No──────────────────┤ 
                           │ tokens              │ → Dashboard
                           │                    │
                           ├─Yes─────────────────┤
                           │ mfaToken+sessionId  │
                           │                    ▼
                           │            ┌─────────────┐
                           │            │   MFAForm   │
                           │            └─────────────┘
                           │                    │
                           │◀───────────────────┤
                           │ verify TOTP/recovery│
                           │                    │
                           │────────────────────▶│
                             tokens              → Dashboard
```

## Key Components

### AuthFlow (`src/modules/Auth/features/Login/AuthFlow.tsx`)
Routes between login and MFA forms based on Redux state:
- Shows `LoginForm` by default
- Shows `MFAForm` when `mfaSession` exists in Redux
- Handles switching between TOTP and recovery code forms
- Cleans up MFA session on unmount

### MFAForm (`src/modules/Auth/features/Login/MFAForm/MFAForm.tsx`)
TOTP verification with:
- 6-digit code input with auto-submit
- Real-time validation and error clearing
- Attempt counter with warnings after 3 attempts
- Session expiry handling (5 minutes)
- Link to switch to recovery code form

### RecoveryCodeForm (`src/modules/Auth/features/Login/MFAForm/RecoveryCodeForm.tsx`)
Alternative authentication:
- Auto-formats input as XXXXX-XXXXX
- Validates alphanumeric format
- Same session management as TOTP form
- Link to switch back to TOTP form

### Redux State (`src/modules/Auth/state/`)
MFA session management:
```typescript
mfaSession: {
  token: string;      // MFA verification token
  sessionId: string;  // Session identifier
  attempts: number;   // Failed attempt count
  expiresAt: number;  // Timestamp for 5-minute expiry
}
```

## API Endpoints

### Login
```
POST /auth/login
Body: { email, password }

Response (MFA enabled):
{
  mfa_required: true,
  mfa_token: "...",
  mfa_session_id: "..."
}

Response (MFA disabled):
{
  access_token: "...",
  refresh_token: "...",
  user: { ... }
}
```

### TOTP Verification
```
POST /auth/mfa/totp/verify
Body: { mfaToken, totpCode }

Response:
{
  access_token: "...",
  refresh_token: "...",
  user: { ... }
}
```

### Recovery Code Verification
```
POST /auth/mfa/recovery/verify  
Body: { mfaToken, code }

Response: (same as TOTP)
```

## Error Handling

Common error responses:
- `Invalid TOTP code` - Wrong or expired code
- `Invalid recovery code` - Wrong recovery code
- `Too many attempts` - After 5 failed attempts
- `MFA session expired` - After 5 minutes

## Testing

Run all MFA tests:
```bash
yarn test:mfa
```

Key test files:
- `AuthFlow.test.tsx` - Flow control tests
- `MFAForm.test.tsx` - TOTP form tests  
- `RecoveryCodeForm.test.tsx` - Recovery code tests
- `mfa.utils.test.ts` - Utility function tests

## Security Notes

1. MFA tokens are stored in Redux state, not localStorage
2. Sessions expire after 5 minutes
3. Maximum 5 attempts before lockout
4. Recovery codes are one-time use only
5. All API calls use HTTPS