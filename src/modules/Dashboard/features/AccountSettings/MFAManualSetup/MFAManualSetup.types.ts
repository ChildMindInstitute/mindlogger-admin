import { VerifyResult } from '../MFASetup/useMFASetup';

export interface MFAManualSetupProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onBack: () => void;
  secretKey: string;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  setVerificationCode: (code: string) => void;
  handleVerify: () => Promise<VerifyResult>;
  clearError: () => void;
  onRecoveryCodes?: (codes: string[]) => void;
}
