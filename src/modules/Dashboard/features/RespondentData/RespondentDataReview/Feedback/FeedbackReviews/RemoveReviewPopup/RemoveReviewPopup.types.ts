import { ReactNode } from 'react';

export type RemoveReviewPopupProps = {
  popupVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  error: ReactNode | null;
  isLoading: boolean;
};
