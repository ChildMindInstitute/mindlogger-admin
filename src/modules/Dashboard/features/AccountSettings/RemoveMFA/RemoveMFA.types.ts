import {
  ErrorScenario,
  ErrorMetadata,
  ErrorResponse,
} from 'modules/Dashboard/features/AccountSettings/shared/mfa';

export interface RemoveMFAProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export { ErrorScenario };
export type { ErrorMetadata, ErrorResponse };
