import { UseFormSetValue, Control } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

import { ItemConfigurationForm } from '../ItemConfiguration.types';

export type OptionalItemsProps = {
  setValue: UseFormSetValue<ItemConfigurationForm>;
  control: Control<ItemConfigurationForm>;
  selectedInputType: ItemConfigurationForm['itemsInputType'];
  settings: ItemConfigurationForm['settings'];
  palette: ItemConfigurationForm['paletteName'];
};

export type OptionalItemsRef = {
  removeAlert: () => void;
  removeOptions: () => void;
  handleAddOption: () => void;
  setSettingsDrawerVisible: (value: boolean) => void;
  setShowColorPalette: Dispatch<SetStateAction<boolean>>;
};
