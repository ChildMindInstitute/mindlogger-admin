import { useEffect } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { ActivitySettingsSubscale } from 'shared/state';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { isSystemItem } from 'shared/utils';

import { ageItem, genderItem } from './SubscalesConfiguration.const';

export const useSubscalesSystemItemsSetup = (
  subscales: FieldArrayWithId<
    Record<string, ActivitySettingsSubscale<string>[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >[],
) => {
  const { fieldName: activityFieldName } = useCurrentActivity();
  const { watch, setValue } = useFormContext();
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
      appendSystemItems([genderItem, ageItem] as ItemFormValues[]);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeSystemItems();
  }, [subscales]);
};
