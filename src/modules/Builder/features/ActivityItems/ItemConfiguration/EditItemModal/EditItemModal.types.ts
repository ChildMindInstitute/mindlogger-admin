import { Dispatch, SetStateAction } from 'react';

export type EditItemModalProps = {
  itemFieldName: string;
  isPopupVisible: boolean;
  setIsPopupVisible: Dispatch<SetStateAction<boolean>>;
  onModalSubmit: () => void;
};
