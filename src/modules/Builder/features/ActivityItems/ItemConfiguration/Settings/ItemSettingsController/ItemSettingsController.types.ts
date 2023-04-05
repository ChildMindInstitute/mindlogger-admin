import { FieldValues, UseControllerProps } from 'react-hook-form';

import { ItemResponseType } from 'shared/state';

import { ItemSettingsGroupNames } from './ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export type ItemSettingsControllerProps<T extends FieldValues> = {
  inputType: ItemResponseType | '';
} & UseControllerProps<T>;

export type ItemSettingsOptionsGroup = {
  groupName: ItemSettingsGroupNames;
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};

export type ItemSettingsOptionsByInputType = {
  [key in ItemResponseType]?: ItemSettingsOptionsGroup[];
};
