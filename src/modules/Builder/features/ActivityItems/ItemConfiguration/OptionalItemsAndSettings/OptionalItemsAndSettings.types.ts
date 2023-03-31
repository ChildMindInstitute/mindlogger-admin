import {
  UseFormSetValue,
  Control,
  UseFormGetValues,
  UseFormWatch,
  UseFormRegister,
  UseFormUnregister,
  UseFormClearErrors,
} from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

import { ItemConfigurationForm } from '../ItemConfiguration.types';

export type OptionalItemsProps = {
  setValue: UseFormSetValue<ItemConfigurationForm>;
  getValues: UseFormGetValues<ItemConfigurationForm>;
  watch: UseFormWatch<ItemConfigurationForm>;
  register: UseFormRegister<ItemConfigurationForm>;
  unregister: UseFormUnregister<ItemConfigurationForm>;
  clearErrors: UseFormClearErrors<ItemConfigurationForm>;
  control: Control<ItemConfigurationForm>;
  selectedInputType: ItemConfigurationForm['itemsInputType'];
  settings: ItemConfigurationForm['settings'];
  palette: ItemConfigurationForm['paletteName'];
};

export type OptionalItemsRef = {
  setSettingsDrawerVisible: (value: boolean) => void;
};

export type ActiveItemHookProps = {
  selectedInputType: ItemConfigurationForm['itemsInputType'];
  control: OptionalItemsProps['control'];
};

export type SettingsSetupProps = {
  setValue: UseFormSetValue<ItemConfigurationForm>;
  getValues: UseFormGetValues<ItemConfigurationForm>;
  watch: UseFormWatch<ItemConfigurationForm>;
  register: UseFormRegister<ItemConfigurationForm>;
  unregister: UseFormUnregister<ItemConfigurationForm>;
  clearErrors: UseFormClearErrors<ItemConfigurationForm>;
  removeOptions?: () => void;
  handleAddOption?: () => void;
  removeAlert?: () => void;
  setShowColorPalette?: Dispatch<SetStateAction<boolean>>;
};
