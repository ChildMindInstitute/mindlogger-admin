import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';

import { checkIfItemHasRequiredOptions } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.utils';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { getObjectFromList, getTextBetweenBrackets } from 'shared/utils';

const checkIfItemsHaveVariables = (items: ItemFormValues[]) => {
  const itemsObject = getObjectFromList(items, ({ name }) => name);

  return items.some(({ question }) => {
    const variableNames = getTextBetweenBrackets(question!);

    return variableNames.some((variable) => !!itemsObject[variable]);
  });
};
export const useCheckIfItemsHaveVariables = () => {
  const { setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const hasVariableAmongItems = checkIfItemsHaveVariables(activityItems);

  useEffect(() => {
    if (!hasVariableAmongItems) return;
    setValue(`${fieldName}.isSkippable`, false);
  }, [hasVariableAmongItems]);

  return hasVariableAmongItems;
};

const checkIfItemsHaveRequiredOptions = (items: ItemFormValues[]) =>
  items.some((item) => checkIfItemHasRequiredOptions(item.config));

export const useCheckIfItemsHaveRequiredItems = () => {
  const { setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const hasRequiredItems = checkIfItemsHaveRequiredOptions(activityItems);

  useEffect(() => {
    if (!hasRequiredItems) return;
    setValue(`${fieldName}.isSkippable`, false);
  }, [hasRequiredItems]);

  return hasRequiredItems;
};
