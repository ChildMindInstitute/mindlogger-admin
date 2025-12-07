export interface MFAManualSetupProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  secretKey: string;
}
