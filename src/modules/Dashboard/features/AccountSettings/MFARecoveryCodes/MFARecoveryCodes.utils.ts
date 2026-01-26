import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

/**
 * Type guard to check if a code is a RecoveryCodeItem object
 */
export const isRecoveryCodeItem = (code: string | RecoveryCodeItem): code is RecoveryCodeItem =>
  typeof code === 'object' && 'used' in code;

/**
 * Extract the code string from either a string or RecoveryCodeItem
 */
export const getCodeString = (code: string | RecoveryCodeItem): string =>
  isRecoveryCodeItem(code) ? code.code : code;

/**
 * Check if a recovery code has been used
 */
export const isCodeUsed = (code: string | RecoveryCodeItem): boolean =>
  isRecoveryCodeItem(code) ? code.used : false;
