import { Dispatch, SetStateAction } from 'react';

export type AddToBuilderPopupProps = {
  addToBuilderPopupVisible: boolean;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
};

export enum AddToBuilderActions {
  CreateNewApplet = 0,
  AddToExistingApplet = 1,
}
