import { ItemFormValues } from 'modules/Builder/types';
import { getTextBetweenBrackets } from 'shared/utils';
import { ItemNameWIthIndex } from 'modules/Builder/features/ActivityItems/ItemConfiguration/OptionalItemsAndSettings/SkippedItemInVariablesModal/SkippedItemInVariablesModal.types';

export const getItemNamesIncludeSkippableItem = (name: string, items: ItemFormValues[]) =>
  items.reduce((acc, item, index) => {
    const variableNames = getTextBetweenBrackets(item.question);
    if (!variableNames?.includes(name)) return acc;

    return [
      ...acc,
      {
        index,
        name: item.name,
      },
    ];
  }, [] as ItemNameWIthIndex[]);
