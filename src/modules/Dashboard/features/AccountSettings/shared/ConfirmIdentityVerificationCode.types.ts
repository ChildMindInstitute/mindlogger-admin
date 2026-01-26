export interface ConfirmIdentityVerificationCodeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (verificationCode: string) => void;
  onUseRecoveryCode: () => void;
  onRetry?: () => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  title: string;
  description: string;
}
