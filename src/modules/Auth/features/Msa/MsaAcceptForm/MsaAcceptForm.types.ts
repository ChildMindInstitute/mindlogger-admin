import { ReactNode } from 'react';

export type MsaAcceptFormProps = {
  // Copy shown above the checkbox, e.g. the title and body of the screen
  children: ReactNode;
  secondaryButtonText: string;
  onSecondaryClick: () => void;
  onAccept: () => void;
  'data-testid'?: string;
};
