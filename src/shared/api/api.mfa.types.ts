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
};

export type MFAStatusResponse = {
  mfaEnabled: boolean;
};
