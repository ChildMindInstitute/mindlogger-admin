import { ReactNode } from 'react';

export interface MFAVerificationFormProps {
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  inputWidth?: string;
  StyledInputContainer: React.ComponentType<{ hasError?: boolean; children: ReactNode }>;
  StyledInput: React.ComponentType<any>;
  StyledButtonContainer: React.ComponentType<{ children: ReactNode }>;
  StyledButton: React.ComponentType<any>;
  StyledErrorMessage: React.ComponentType<{ children: ReactNode }>;
}
