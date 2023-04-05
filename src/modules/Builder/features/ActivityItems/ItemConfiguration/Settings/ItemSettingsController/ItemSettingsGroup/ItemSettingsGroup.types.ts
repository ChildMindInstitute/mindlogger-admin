import { ItemResponseType } from 'shared/state';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';

export type ItemSettingsGroupProps = {
  value?: any;
  onChange: (...event: any[]) => void;
  groupName: ItemSettingsGroupNames;
  inputType: ItemResponseType | '';
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};
