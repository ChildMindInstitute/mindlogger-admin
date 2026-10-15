import { ReactNode } from 'react';

export type MsaAcceptFormProps = {
  // Copy shown above the checkbox, e.g. the title and body of the screen
  children: ReactNode;
  secondaryButtonText: string;
  onSecondaryClick: () => void;
  onAccept: () => void;
  // Disables the form while the acceptance is being saved
  isSaving?: boolean;
  // Shown above the checkbox when saving failed; the accept button then reads "Try again"
  error?: string;
  'data-testid'?: string;
};
