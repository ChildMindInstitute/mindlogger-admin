import { ItemFormValues } from 'modules/Builder/types';
import { ConditionalLogic } from 'shared/state';
import { getEntityKey, getObjectFromList, getTextBetweenBrackets } from 'shared/utils';

import { GetConditionsToRemoveConfig, ItemNameWithIndex } from './ActivityItems.types';

export const getItemConditionDependencies = (item: ItemFormValues, conditionalLogic?: ConditionalLogic[]) =>
  conditionalLogic?.filter(
    ({ itemKey, conditions }) =>
      itemKey === getEntityKey(item) || conditions?.some(({ itemName }) => itemName === getEntityKey(item)),
  );

export const getConditionsToRemove = ({
  items,
  config,
  conditionalLogic,
}: {
  items: ItemFormValues[];
  config: GetConditionsToRemoveConfig;
  conditionalLogic?: ConditionalLogic[];
}) => {
  if (!conditionalLogic) return;

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

const checkIfQuestionIncludesItem = (question: string, itemName: string) => {
  const variableNames = getTextBetweenBrackets(question);

  return variableNames.includes(itemName);
};

export const getIndexListToTrigger = (items: ItemFormValues[], itemName: string) =>
  items.reduce((acc, { question }, index) => {
    if (checkIfQuestionIncludesItem(question!, itemName)) return acc.concat(index);

    return acc;
  }, [] as number[]);

export const getItemsWithVariable = (name: string, items: ItemFormValues[]) =>
  items.reduce((acc, item, index) => {
    const variableNames = getTextBetweenBrackets(item.question!);
    if (!variableNames?.includes(name)) return acc;

    return [
      ...acc,
      {
        index,
        name: item.name,
      },
    ];
  }, [] as ItemNameWithIndex[]);
