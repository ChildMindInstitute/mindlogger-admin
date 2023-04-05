import { ItemResponseType } from 'shared/state';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

export type ActivityItemApi = {
  id: string;
  itemsInputType: ItemResponseType | '';
  name: string;
  body: string;
  hidden: boolean;
  settings: ItemConfigurationSettings[];
};
