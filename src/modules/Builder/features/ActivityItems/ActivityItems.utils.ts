import { ItemFormValues } from 'modules/Builder';
import { ConditionalLogic, Item } from 'shared/state';
import { getEntityKey } from 'shared/utils';

import { GetConditionsToRemoveConfig } from './ActivityItems.types';

export const getSummaryRowDependencies = (
  item: ItemFormValues,
  conditionalLogic?: ConditionalLogic[],
) => conditionalLogic?.filter(({ itemKey }) => getEntityKey(item) === itemKey);

export const getItemConditionDependencies = (
  item: ItemFormValues,
  conditionalLogic?: ConditionalLogic[],
) =>
  conditionalLogic?.filter(
    ({ itemKey, conditions }) =>
      itemKey === getEntityKey(item) ||
      conditions?.some(({ itemName }) => itemName === getEntityKey(item)),
  );

export const getConditionsToRemove = (
  items: ItemFormValues[],
  conditionalLogic: ConditionalLogic[],
  config: GetConditionsToRemoveConfig,
) => {
  const { sourceIndex, destinationIndex, item } = config;

  const conditions = getItemConditionDependencies(item, conditionalLogic);

  if (!conditions?.length) return;

  return conditions.filter(({ itemKey, conditions }) => {
    //if SOURCE ITEM is in summary row, we should check that ALL DEPENDENCIES are still above the SOURCE ITEM
    if (getEntityKey(item) === itemKey)
      return conditions?.some(({ itemName }) => {
        const itemIndex = items?.findIndex((item) => getEntityKey(item) === itemName);

        return destinationIndex === itemIndex && sourceIndex < itemIndex
          ? destinationIndex < itemIndex
          : destinationIndex <= itemIndex;
      });

    //if SOURCE ITEM is dependent for the other, we should check that SOURCE ITEM is still above the DEPENDENCY
    const itemIndex = items?.findIndex((item) => getEntityKey(item) === itemKey);

    return destinationIndex === itemIndex && sourceIndex > itemIndex
      ? destinationIndex > itemIndex
      : destinationIndex >= itemIndex;
  });
};
