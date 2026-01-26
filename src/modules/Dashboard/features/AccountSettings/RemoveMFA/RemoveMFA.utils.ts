import { AxiosError } from 'axios';

import { createErrorParser } from 'modules/Dashboard/features/AccountSettings/shared/mfa';

import {
  MFA_DISABLE_ERROR_MESSAGES,
  BACKEND_ERROR_PATTERNS,
  MFA_DISABLE_STATUS_CODES,
} from './RemoveMFA.constants';

export const parseError = createErrorParser(
  MFA_DISABLE_ERROR_MESSAGES,
  BACKEND_ERROR_PATTERNS,
  MFA_DISABLE_STATUS_CODES,
);

export const getErrorMessage = (error: AxiosError): string => parseError(error).message;
