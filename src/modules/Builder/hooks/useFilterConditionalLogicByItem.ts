import { ConditionalLogic } from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { ItemFormValues } from 'modules/Builder/types';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';

import { useCustomFormContext } from './useCustomFormContext';

export const useFilterConditionalLogicByItem = (item: ItemFormValues) => {
  const { fieldName, activity } = useCurrentActivity();
  const { watch, setValue } = useCustomFormContext();
  const conditionalLogicForItemToDelete = getItemConditionDependencies(item, activity?.conditionalLogic);
  const conditionalLogic = watch(`${fieldName}.conditionalLogic`);

  return () => {
    if (!conditionalLogicForItemToDelete?.length) return;

    const conditionalLogicKeysToRemove = conditionalLogicForItemToDelete.map((condition: ConditionalLogic) =>
      getEntityKey(condition),
    );
    setValue(
      `${fieldName}.conditionalLogic`,
      conditionalLogic?.filter(
        (conditionalLogic: ConditionalLogic) => !conditionalLogicKeysToRemove.includes(getEntityKey(conditionalLogic)),
      ),
    );
  };
};
