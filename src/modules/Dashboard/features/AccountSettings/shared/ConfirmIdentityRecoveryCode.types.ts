export interface ConfirmIdentityRecoveryCodeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (recoveryCode: string) => void;
  onBack: () => void;
  onRetry?: () => void; // Shows "Try Again" button when provided
  recoveryCode: string;
  setRecoveryCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}
