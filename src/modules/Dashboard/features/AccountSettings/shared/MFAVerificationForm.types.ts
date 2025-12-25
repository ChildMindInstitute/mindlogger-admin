import { ReactNode, ComponentType } from 'react';

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
  StyledInputContainer: ComponentType<any>;
  StyledInput: ComponentType<any>;
  StyledButtonContainer: ComponentType<{ children: ReactNode }>;
  StyledButton: ComponentType<any>;
  StyledErrorMessage: ComponentType<{ children: ReactNode }>;
}
