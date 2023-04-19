import { ItemResponseType } from 'shared/consts';

export const getDefaultValue = (responseType: ItemResponseType) => {
  switch (responseType) {
    case ItemResponseType.Slider:
      return 0;
    case ItemResponseType.MultipleSelection:
      return [];
    default:
      return '';
  }
};
