import { ActivitySettingsSubscaleItem } from 'redux/modules';
import { LookupTableItems } from 'shared/consts';
import { ItemFormValues } from 'modules/Builder/types';

export const isSystemItem = (item: ItemFormValues | ActivitySettingsSubscaleItem) =>
  !item.allowEdit && (item.name === LookupTableItems.Age_screen || item.name === LookupTableItems.Gender_screen);
