import { Dispatch, SetStateAction } from 'react';

import { ItemResponseType } from 'shared/consts';

export type OptionalItemsProps = {
  name: string;
};

export type OptionalItemsRef = {
  setSettingsDrawerVisible: (value: boolean) => void;
};

export type ActiveItemHookProps = {
  name: string;
  responseType: ItemResponseType | '';
};

export type SettingsSetupProps = {
  name: string;
  handleAddOption?: (isAppendedOption: boolean) => void;
  removeOptions?: () => void;
  handleAddSliderRow?: () => void;
  handleAddSingleOrMultipleRow?: () => void;
  removeAlert?: () => void;
  handleAddAlert?: () => void;
  handleRemovePalette?: () => void;
  setOptionsOpen?: Dispatch<SetStateAction<boolean[]>>;
};
