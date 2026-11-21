// Errors that only a new login can fix, with the message shown on the login page
export const RELOGIN_ERROR_KEYS: Record<string, string> = {
  'AUTH.MSA.TOKEN_EXPIRED': 'mfaSessionExpired',
  'AUTH.MSA.TOKEN_INVALID': 'mfaSessionExpired',
  'LEGAL.MSA_VERSION_OUTDATED': 'msaVersionChanged',
};
