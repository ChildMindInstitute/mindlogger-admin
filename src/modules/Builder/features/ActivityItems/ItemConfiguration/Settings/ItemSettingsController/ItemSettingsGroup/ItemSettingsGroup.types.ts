import { ItemResponseType } from 'shared/consts';

import { ItemSettingsGroupNames } from '../ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';

export type ItemSettingsGroupProps = {
  name: string;
  value?: any;
  onChange: (...event: any[]) => void;
  groupName: ItemSettingsGroupNames;
  inputType: ItemResponseType | '';
  groupOptions: ItemConfigurationSettings[];
  collapsedByDefault?: boolean;
};
