export interface MFARecoveryCodesProps {
  open: boolean;
  onClose: () => void;
  recoveryCodes: string[];
  onConfirm: () => void;
  downloadToken?: string; // Optional: Token to download codes from backend. If not provided, codes are generated on frontend.
}
