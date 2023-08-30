import { Dispatch, SetStateAction } from 'react';

export type DeleteItemModalProps = {
  itemIdToDelete: string;
  setItemIdToDelete: Dispatch<SetStateAction<string>>;
  activeItemIndex: number;
  setActiveItemIndex: Dispatch<SetStateAction<number>>;
};
