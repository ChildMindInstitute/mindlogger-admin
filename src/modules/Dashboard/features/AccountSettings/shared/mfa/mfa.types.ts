export enum ErrorScenario {
  INVALID_CODE = 'INVALID_CODE',
  MAX_SESSION_ATTEMPTS = 'MAX_SESSION_ATTEMPTS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  GLOBAL_LOCKOUT = 'GLOBAL_LOCKOUT',
  GENERIC = 'GENERIC',
}

export interface ErrorMetadata {
  session_attempts_remaining?: number;
  global_attempts_remaining?: number;
  lockout_expires_at?: string;
}

export interface ErrorResponse {
  result?: Array<{
    message?: string;
    type?: string;
    path?: string[];
  }>;
  metadata?: ErrorMetadata;
  error_code?: string;
}
