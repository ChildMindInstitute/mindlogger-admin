import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { ActivitySettingsSubscale } from 'shared/state';

import { ageItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = () => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { watch, setValue } = useFormContext();
  const itemsFieldName = `${activityFieldName}.items`;
  const items: ItemFormValues[] = watch(itemsFieldName) ?? [];
  const subscalesField = `${activityFieldName}.subscaleSetting.subscales`;
  const subscales: ActivitySettingsSubscale[] = watch(subscalesField);

  const appendItem = (item: ItemFormValues) => setValue(itemsFieldName, [...items, item]);
  const removeItem = (index: number | number[]) =>
    setValue(
      itemsFieldName,
      items.filter((_, key) => (Array.isArray(index) ? index.includes(key) : index !== key)),
    );

  useEffect(() => {
    const hasSubscaleLookupTable = subscales.some((subscale) => !!subscale.subscaleTableData);
    const subscaleSystemItems =
      items?.reduce((acc, item, index) => {
        if (!item.allowEdit) return acc.concat({ ...item, index });

        return acc;
      }, [] as (ItemFormValues & { index: number })[]) ?? [];
    const shouldAddSubscaleSystemItems = hasSubscaleLookupTable && !subscaleSystemItems.length;

    if (shouldAddSubscaleSystemItems) {
      appendItem(genderItem as ItemFormValues);
      appendItem(ageItem as ItemFormValues);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeItem(subscaleSystemItems.map((item) => item.index));
  }, [subscales]);
};
