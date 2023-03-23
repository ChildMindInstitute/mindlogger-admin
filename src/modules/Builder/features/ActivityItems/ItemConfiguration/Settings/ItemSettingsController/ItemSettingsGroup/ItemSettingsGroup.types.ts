import { ItemInputTypes } from 'shared/types';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';

export type ItemSettingsGroupProps = {
  value?: any;
  onChange: (...event: any[]) => void;
  groupName: ItemSettingsGroupNames;
  inputType: ItemInputTypes | '';
  groupOptions: ItemConfigurationSettings[];
};
