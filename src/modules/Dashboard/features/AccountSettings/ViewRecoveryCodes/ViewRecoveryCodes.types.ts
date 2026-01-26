import {
  ErrorScenario,
  ErrorMetadata,
  ErrorResponse,
} from 'modules/Dashboard/features/AccountSettings/shared/mfa';

export interface ViewRecoveryCodesProps {
  open: boolean;
  onClose: () => void;
}

export { ErrorScenario };
export type { ErrorMetadata, ErrorResponse };
