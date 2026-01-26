import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

export interface MFARecoveryCodesProps {
  open: boolean;
  onClose: () => void;
  recoveryCodes: string[] | RecoveryCodeItem[]; // Support both formats: setup (strings) and viewing (with used status)
  onConfirm: () => void;
  downloadToken?: string; // Optional: Token to download codes from backend. If not provided, codes are generated on frontend.
}
