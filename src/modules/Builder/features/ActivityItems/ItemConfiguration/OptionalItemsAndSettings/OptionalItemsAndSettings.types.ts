import { Dispatch, SetStateAction } from 'react';

import { ItemResponseType } from 'shared/consts';
import { ActivityItemPath } from 'modules/Builder/types';

export type OptionalItemsProps = {
  name: ActivityItemPath;
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
  setShowColorPalette?: (visibility: boolean) => void;
  setOptionsOpen?: Dispatch<SetStateAction<boolean[]>>;
};
