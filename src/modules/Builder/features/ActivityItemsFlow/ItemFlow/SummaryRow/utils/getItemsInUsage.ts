import { GetItemsInUsageProps } from '../SummaryRow.types';

export const getItemsInUsage = ({ conditionalLogic, itemKey }: GetItemsInUsageProps) =>
  (conditionalLogic ?? []).reduce((acc, conditional) => {
    if (!conditional.itemKey || conditional.itemKey === itemKey) return acc;

    return acc.add(conditional.itemKey);
  }, new Set());
