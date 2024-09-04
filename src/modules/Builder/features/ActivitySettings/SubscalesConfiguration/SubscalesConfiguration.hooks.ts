import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { isSystemItem } from 'shared/utils';
import { AgeFieldType } from 'shared/state';

import { ageDropdownItem, ageTextItem, genderItem } from './SubscalesConfiguration.const';
import { LookupTableItems } from '../../../../../shared/consts';

export const useSubscalesSystemItemsSetup = (
  subscales: SubscaleFormValue[],
  ageFieldType: AgeFieldType,
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
      items.filter((item) => !isSystemItem(item)),
    );
  const replaceSystemItems = (newItems: ItemFormValues[]) => {
    setValue(itemsFieldName, [...items.filter((item) => !isSystemItem(item)), ...newItems], { shouldDirty: true });
  };
  useEffect(() => {
    const hasSubscaleLookupTable = subscales?.some((subscale) => !!subscale.subscaleTableData);
    const hasSystemItems = items?.some((item) => isSystemItem(item));
    const shouldAddSubscaleSystemItems = hasSubscaleLookupTable && !hasSystemItems;

    const ageScreenItem = items?.find((item) => item.name === LookupTableItems.Age_screen);
    const oldAgeFieldType = ageScreenItem?.responseType === 'numberSelect' ? 'dropdown' : 'text';
    const ageFieldTypeChanged = oldAgeFieldType !== ageFieldType;
    const shouldEditSubscaleSystemItems =
      hasSubscaleLookupTable && hasSystemItems && ageFieldTypeChanged;

    const ageField: ItemFormValues = ageFieldType === 'dropdown' ? ageDropdownItem : ageTextItem;

    if (shouldAddSubscaleSystemItems) {
      appendSystemItems([genderItem, ageField]);

      return;
    } else if (shouldEditSubscaleSystemItems) {
      replaceSystemItems([genderItem, ageField]);

      return;
    }

    if (hasSubscaleLookupTable) return;

    removeSystemItems();
  }, [subscales, ageFieldType]);
};
