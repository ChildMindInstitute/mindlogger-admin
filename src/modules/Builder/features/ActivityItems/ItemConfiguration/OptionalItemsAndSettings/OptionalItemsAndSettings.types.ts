import { ItemResponseType } from 'shared/consts';

export type OptionalItemsProps = {
  name: string;
};

export type OptionalItemsRef = {
  setSettingsDrawerVisible: (value: boolean) => void;
};

export type ActiveItemHookProps = {
  name: string;
  responseType: ItemResponseType;
};

export type SettingsSetupProps = {
  name: string;
  removeOptions?: () => void;
  handleAddOption?: () => void;
  removeRows?: () => void;
  handleAddRow?: () => void;
  removeAlert?: () => void;
  handleAddAlert?: () => void;
  setShowColorPalette?: (visibility: boolean) => void;
};
