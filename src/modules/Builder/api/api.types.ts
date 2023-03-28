import { ItemInputTypes } from 'shared/types';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

export type APIItem = {
  id: string;
  itemsInputType: ItemInputTypes | '';
  name: string;
  body: string;
  hidden: boolean;
  settings: ItemConfigurationSettings[];
};
