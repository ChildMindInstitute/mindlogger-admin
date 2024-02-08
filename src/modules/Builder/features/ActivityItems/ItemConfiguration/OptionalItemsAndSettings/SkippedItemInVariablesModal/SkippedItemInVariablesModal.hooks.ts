import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { ItemTestFunctions } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { getItemsWithVariable } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { ItemNameWithIndex } from 'modules/Builder/features/ActivityItems/ActivityItems.types';
import { useCustomFormContext } from 'modules/Builder/hooks';

export const useCheckIfItemHasVariables = (itemField: string) => {
  const { t } = useTranslation('app');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { watch, setError, trigger } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const name = watch(`${itemField}.name`) ?? '';
  const isSkippableItem = watch(`${itemField}.config.skippableItem`);
  const itemNamesWithSkippedItemRef = useRef<null | ItemNameWithIndex[]>(null);

  const onPopupConfirm = () => {
    for (const item of itemNamesWithSkippedItemRef.current ?? []) {
      setError(`${fieldName}.items.${item.index}.question`, {
        type: ItemTestFunctions.VariableReferringToSkippedItem,
        message: t('validationMessages.variableReferringToSkippedItem'),
      });
    }
    itemNamesWithSkippedItemRef.current = null;
    setIsPopupVisible(false);
  };

  useEffect(() => {
    itemNamesWithSkippedItemRef.current = getItemsWithVariable(name, activityItems);
    if (!itemNamesWithSkippedItemRef.current?.length) return;

    if (!isSkippableItem) {
      for (const item of itemNamesWithSkippedItemRef.current ?? []) {
        trigger(`${fieldName}.items.${item.index}`);
      }

      return;
    }

    setIsPopupVisible(true);
  }, [isSkippableItem]);

  return {
    isPopupVisible,
    skippedItemName: name,
    itemNamesWithSkippedItem: itemNamesWithSkippedItemRef.current?.map(item => item.name).join(', '),
    onPopupConfirm,
  };
};
