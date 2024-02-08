import { FieldValues, UseControllerProps } from 'react-hook-form';

import { ItemResponseType } from 'shared/consts';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { ItemSettingsGroupNames } from './ItemSettingsController.const';

export type ItemSettingsControllerProps<T extends FieldValues> = {
  inputType: ItemResponseType | '';
  itemName: string;
} & UseControllerProps<T>;

export type ItemSettingsOptionsGroup = {
  groupName: ItemSettingsGroupNames;
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};

export type ItemSettingsOptionsByInputType = {
  [key in ItemResponseType]?: ItemSettingsOptionsGroup[];
};
