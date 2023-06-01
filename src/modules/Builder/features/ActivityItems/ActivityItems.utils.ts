import { ConditionalLogic } from 'shared/state';
import { getEntityKey, getObjectFromList } from 'shared/utils';
import { ItemFormValues } from 'modules/Builder/types';

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

  const dependentConditions = getItemConditionDependencies(item, conditionalLogic);

  if (!dependentConditions?.length) return;

  const numberToAdd = sourceIndex < destinationIndex ? 1 : 0;
  const leftSlice = getObjectFromList(items?.slice(0, destinationIndex + numberToAdd));
  const rightSlice = getObjectFromList(items?.slice(destinationIndex + numberToAdd));

  return dependentConditions.filter(({ itemKey = '', conditions }) => {
    if (getEntityKey(item) === itemKey) {
      //if SOURCE ITEM is in summary row, we should check that ALL DEPENDENCIES are to the left from the SOURCE
      return !conditions?.every(({ itemName }) => leftSlice[itemName]);
    }

    //if SOURCE ITEM is dependent for the other, we should check that SOURCE ITEM is to the right from the DEPENDENCY
    return !rightSlice[itemKey];
  });
};
