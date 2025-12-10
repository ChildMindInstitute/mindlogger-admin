export interface MFARecoveryCodesProps {
  open: boolean;
  onClose: () => void;
  recoveryCodes: string[];
  onConfirm: () => void;
}
