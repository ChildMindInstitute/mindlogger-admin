import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';
import { ItemInputTypes } from 'shared/types';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';

export type ItemSettingsGroupProps = {
  value?: any;
  onChange: (...event: any[]) => void;
  groupName: ItemSettingsGroupNames;
  inputType: ItemInputTypes | '';
  groupOptions: ItemConfigurationSettings[];
};
