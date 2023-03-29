import { ItemInputTypes } from 'shared/types';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

export type ApiItem = {
  id: string;
  itemsInputType: ItemInputTypes | '';
  name: string;
  body: string;
  hidden: boolean;
  settings: ItemConfigurationSettings[];
};
