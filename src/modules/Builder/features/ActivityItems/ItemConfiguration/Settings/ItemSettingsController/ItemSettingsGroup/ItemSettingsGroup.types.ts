import { ItemResponseType } from 'shared/consts';
import { Config } from 'shared/state';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';

export type ItemSettingsGroupProps = {
  name: string;
  value?: Config;
  onChange: (event: Config) => void;
  itemName: string;
  groupName: ItemSettingsGroupNames;
  inputType: ItemResponseType | '';
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};
