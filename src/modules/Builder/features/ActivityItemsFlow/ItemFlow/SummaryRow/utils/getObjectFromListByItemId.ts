import { ItemResponseType } from 'shared/consts';
import { Condition, ResponseValues } from 'shared/state';

import { ConditionWithResponseType } from '../SummaryRow.types';

export const getObjectFromListByItemId = (conditions: ConditionWithResponseType[]) =>
  conditions.reduce(
    (acc, condition) => {
      const { responseType: itemType, ...rest } = condition;
      const itemId = condition.itemName;
      if (!itemId || !itemType) return acc;

      if (acc[itemId]) {
        acc[itemId].conditions.push(rest);
      } else {
        acc[itemId] = {
          itemType,
          conditions: [rest],
        };
      }

      return acc;
    },
    {} as Record<
      string,
      {
        itemType: ItemResponseType;
        conditions: (Condition & { responseValues: ResponseValues })[];
      }
    >,
  );
