import { FieldValues, UseControllerProps, Path } from 'react-hook-form';

import { ItemInputTypes } from 'shared/types';

import { ItemSettingsGroupNames } from './ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export type ItemSettingsControllerProps<T extends FieldValues> = {
  inputType: ItemInputTypes | '';
} & UseControllerProps<T>;

export type ItemSettingsOptionsGroup = {
  groupName: ItemSettingsGroupNames;
  groupOptions: ItemConfigurationSettings[];
};

export type ItemSettingsOptionsByInputType = {
  [key in ItemInputTypes]?: ItemSettingsOptionsGroup[];
};
