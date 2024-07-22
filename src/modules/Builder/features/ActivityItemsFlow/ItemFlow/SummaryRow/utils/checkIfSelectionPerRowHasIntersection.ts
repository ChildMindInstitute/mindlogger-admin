import { SingleMultiSelectionPerRowCondition } from 'shared/state/Applet';

import { CheckIfSelectionsIntersectionProps, GroupedConditionsByRow } from '../SummaryRow.types';
import { checkIfSelectionsHasIntersection } from './checkIfSelectionsHasIntersection';

export const checkIfSelectionPerRowHasIntersection = <
  T extends SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const groupedConditionsByRow = conditions.reduce((acc, condition) => {
    const payload = (condition as T).payload;
    const rowIndex = payload?.rowIndex;
    if (rowIndex === undefined || rowIndex === '') return acc;

    if (acc[+rowIndex])
      return {
        ...acc,
        [+rowIndex]: acc[+rowIndex].concat(condition),
      };

    return {
      ...acc,
      [+rowIndex]: [condition],
    };
  }, {} as GroupedConditionsByRow);

  return Object.entries(groupedConditionsByRow).some((entity) =>
    checkIfSelectionsHasIntersection({
      conditions: entity[1],
      sameOptionValue,
      inverseOptionValue,
    }),
  );
};
