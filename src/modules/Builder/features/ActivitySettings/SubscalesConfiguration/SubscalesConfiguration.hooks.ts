import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ItemFormValues } from 'modules/Builder/pages';
import { ActivitySettingsSubscale } from 'shared/state';

import { ageItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = () => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { control, watch } = useFormContext();
  const itemsFieldName = `${activityFieldName}.items`;
  const items: ItemFormValues[] = watch(itemsFieldName);
  const { append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: itemsFieldName,
  });
  const subscalesField = `${activityFieldName}.subscales`;
  const subscales: ActivitySettingsSubscale[] = watch(subscalesField) ?? [];

  useEffect(() => {
    const hasSubscaleLookupTable = subscales.some((subscale) => !!subscale.subscaleTableData);
    const subscaleSystemItems = items.reduce((acc, item, index) => {
      if (item.isSubscaleSystemItem) return acc.concat({ ...item, index });

      return acc;
    }, [] as (ItemFormValues & { index: number })[]);
    const shouldAddSubscaleSystemItems = hasSubscaleLookupTable && !subscaleSystemItems.length;

    if (shouldAddSubscaleSystemItems) {
      appendItem(genderItem);
      appendItem(ageItem);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeItem(subscaleSystemItems.map((item) => item.index));
  }, [subscales]);
};
