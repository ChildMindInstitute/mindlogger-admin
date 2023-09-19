import { MouseEvent } from 'react';

export type ActionButtonsProps = {
  isPrimaryUiType: boolean;
  showFirstButton: boolean;
  showSecondButton: boolean;
  onEditImg: (event: MouseEvent) => void;
  onDeleteImg: (event: MouseEvent) => void;
};
