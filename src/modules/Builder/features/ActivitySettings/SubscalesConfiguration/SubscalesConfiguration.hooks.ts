import { useEffect } from 'react';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { isSystemItem } from 'shared/utils';

import { ageItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = (subscales: SubscaleFormValue[]) => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { watch, setValue } = useCustomFormContext();
  const itemsFieldName = `${activityFieldName}.items`;
  const items: ItemFormValues[] = watch(itemsFieldName) ?? [];

  const appendSystemItems = (newItems: ItemFormValues[]) =>
    setValue(itemsFieldName, [...items, ...newItems]);
  const removeSystemItems = () =>
    setValue(
      itemsFieldName,
      items.filter((item) => !isSystemItem(item.name)),
    );
  useEffect(() => {
    const hasSubscaleLookupTable = subscales?.some((subscale) => !!subscale.subscaleTableData);
    const hasSystemItems = items?.some((item) => isSystemItem(item.name));
    const shouldAddSubscaleSystemItems = hasSubscaleLookupTable && !hasSystemItems;

    if (shouldAddSubscaleSystemItems) {
      appendSystemItems([genderItem, ageItem]);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeSystemItems();
  }, [subscales]);
};
