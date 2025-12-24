/**
 * Mock data for MFA tests
 * Centralized location for all test data to ensure consistency
 */

/**
 * Mock provisioning URI for TOTP setup
 * Format: otpauth://totp/[issuer]:[email]?secret=[SECRET]&issuer=[issuer]
 * This is what the backend returns when initiating MFA setup
 */
export const mockProvisioningUri =
  'otpauth://totp/MindLogger:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MindLogger';

/**
 * Mock secret key extracted from provisioning URI
 * This is the base32-encoded secret that users manually enter
 */
export const mockSecretKey = 'JBSWY3DPEHPK3PXP';

/**
 * Mock 6-digit verification codes from authenticator app
 */
export const mockValidVerificationCode = '123456';
export const mockInvalidVerificationCode = '000000';

/**
 * Mock recovery codes (format: XXXXX-XXXXX)
 * These are backup codes users can use if they lose their authenticator
 */
export const mockRecoveryCodes = [
  'ABCDE-12345',
  'FGHIJ-67890',
  'KLMNO-11111',
  'PQRST-22222',
  'UVWXY-33333',
  'ZABCD-44444',
  'EFGHI-55555',
  'JKLMN-66666',
];

/**
 * Mock recovery code items with usage status
 * Used when viewing existing recovery codes
 */
export const mockUsedRecoveryCode = {
  code: 'ABCDE-12345',
  used: true,
  usedAt: '2024-01-15T10:30:00Z',
};

export const mockUnusedRecoveryCode = {
  code: 'FGHIJ-67890',
  used: false,
  usedAt: null,
};

export const mockRecoveryCodesList = [
  mockUsedRecoveryCode,
  mockUnusedRecoveryCode,
  {
    code: 'KLMNO-11111',
    used: false,
    usedAt: null,
  },
];

/**
 * Mock tokens
 * Short-lived tokens (5 min expiry) for downloading recovery codes
 */
export const mockDownloadToken = 'mock-download-token-abc123def456';
export const mockMfaToken = 'mock-mfa-token-xyz789uvw012';

/**
 * Mock API responses for successful operations
 */
export const mockMFAInitiateResponse = {
  data: {
    result: {
      provisioningUri: mockProvisioningUri,
      message: 'MFA setup initiated successfully',
    },
  },
};

export const mockMFAVerifyResponse = {
  data: {
    result: {
      mfaEnabled: true,
      message: 'MFA enabled successfully',
      recoveryCodes: mockRecoveryCodes,
      downloadToken: mockDownloadToken,
    },
  },
};

export const mockMFAStatusResponse = {
  data: {
    result: {
      mfaEnabled: true,
    },
  },
};

export const mockRecoveryCodesListResponse = {
  data: {
    result: {
      codes: mockRecoveryCodesList,
      total: 8,
      unusedCount: 7,
      downloadToken: mockDownloadToken,
    },
  },
};

export const mockMFADisableInitiateResponse = {
  data: {
    result: {
      mfaRequired: true,
      mfaToken: mockMfaToken,
      message: 'Please verify your identity',
    },
  },
};

export const mockMFADisableVerifyResponse = {
  data: {
    result: {
      mfaDisabled: true,
      message: 'MFA disabled successfully',
    },
  },
};

export const mockViewRecoveryCodesInitiateResponse = {
  data: {
    result: {
      mfaRequired: true,
      mfaToken: mockMfaToken,
      message: 'Please verify your identity',
    },
  },
};

/**
 * Mock error responses
 * These match the actual backend error formats
 */
export const mockInvalidCodeError = {
  response: {
    status: 400,
    data: {
      result: [
        {
          message: 'Invalid TOTP code',
        },
      ],
    },
  },
};

export const mockExpiredSetupError = {
  response: {
    status: 410,
    data: {
      result: [
        {
          message: 'MFA setup has expired',
        },
      ],
    },
  },
};

export const mockAlreadyEnabledError = {
  response: {
    status: 409,
    data: {
      result: [
        {
          message: 'MFA is already enabled for this account',
        },
      ],
    },
  },
};

export const mockSetupNotFoundError = {
  response: {
    status: 404,
    data: {
      result: [
        {
          message: 'No pending MFA setup found',
        },
      ],
    },
  },
};

export const mockNetworkError = {
  code: 'ERR_NETWORK',
  message: 'Network Error',
};

/**
 * Mock file blob for recovery codes download
 */
export const mockRecoveryCodesBlob = new Blob(['recovery codes content'], {
  type: 'text/plain',
});

/**
 * Mock download response
 */
export const mockDownloadResponse = {
  data: mockRecoveryCodesBlob,
  headers: {
    'content-disposition': 'attachment; filename="recovery-codes.txt"',
  },
};
