export interface MFAManualSetupProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  secretKey: string;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  setVerificationCode: (code: string) => void;
  handleVerify: () => Promise<boolean>;
  clearError: () => void;
}
