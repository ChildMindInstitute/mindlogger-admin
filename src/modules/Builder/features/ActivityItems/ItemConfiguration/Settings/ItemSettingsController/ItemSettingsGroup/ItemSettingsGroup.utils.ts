import { getEntityKey, without } from 'shared/utils';

import { RemoveItemFromSubscales } from './ItemSettingsGroup.types';

export const removeItemFromSubscales = ({ setValue, subscales, subscalesName, item }: RemoveItemFromSubscales) => {
  const itemKey = getEntityKey(item);

  subscales?.forEach((subscale, index) => {
    const subscaleItems = subscale.items;

    if (subscaleItems?.includes(itemKey)) {
      setValue(`${subscalesName}.${index}.items`, without(subscaleItems, itemKey));
    }
  });
};
