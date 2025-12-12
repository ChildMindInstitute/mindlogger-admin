export interface ConfirmIdentityRecoveryCodeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (recoveryCode: string) => void;
  onBack: () => void;
  recoveryCode: string;
  setRecoveryCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}
