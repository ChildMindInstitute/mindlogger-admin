import { UseFormSetValue, FieldValues } from 'react-hook-form';

import { ItemResponseType } from 'shared/consts';
import { Config } from 'shared/state';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { ITEM_TYPES_TO_HAVE_ALERTS } from './ItemSettingsGroup.const';

export type ItemSettingsGroupProps = {
  name: string;
  value?: Config;
  onChange: (event: Config) => void;
  itemName: string;
  groupName: ItemSettingsGroupNames;
  inputType?: ItemResponseType;
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};

export type RemoveItemFromSubscales = {
  setValue: UseFormSetValue<FieldValues>;
  subscales: SubscaleFormValue[];
  subscalesName: string;
  item: ItemFormValues;
};

export type ItemTypeWithAlerts = (typeof ITEM_TYPES_TO_HAVE_ALERTS)[number];

export const isItemTypeWithAlerts = (
  inputType?: ItemResponseType,
): inputType is ItemTypeWithAlerts =>
  !!inputType && ITEM_TYPES_TO_HAVE_ALERTS.includes(inputType as ItemTypeWithAlerts);
