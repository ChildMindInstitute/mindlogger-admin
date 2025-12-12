/**
 * MFA API Types
 * These types match the backend API contract for MFA setup
 */

export type MFAInitiateResponse = {
  provisioningUri: string;
  message: string;
};

export type MFAVerifyRequest = {
  code: string; // 6-digit TOTP code
};

export type MFAVerifyResponse = {
  message: string;
  mfaEnabled: boolean;
  recoveryCodes?: string[];
  downloadToken?: string; // Short-lived token (5 min) for downloading recovery codes
};

export type MFAStatusResponse = {
  mfaEnabled: boolean;
};

export type RecoveryCodeItem = {
  code: string; // Format: XXXXX-XXXXX
  used: boolean;
  usedAt: string | null; // ISO date string
};

export type RecoveryCodesListResponse = {
  codes: RecoveryCodeItem[];
  total: number;
  unusedCount: number;
  downloadToken: string; // Short-lived JWT for downloading codes (5 min expiry)
};

export type RecoveryCodesViewInitiateResponse = {
  mfaRequired: boolean;
  mfaToken: string;
  message: string;
};

export type RecoveryCodesViewVerifyRequest = {
  mfaToken: string;
  code: string; // 6-digit TOTP code OR 11-character recovery code (XXXXX-XXXXX)
};
