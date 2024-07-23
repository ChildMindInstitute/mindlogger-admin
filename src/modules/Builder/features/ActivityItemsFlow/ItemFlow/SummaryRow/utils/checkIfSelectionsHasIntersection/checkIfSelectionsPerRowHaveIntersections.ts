import {
  SingleAndMultipleSelectRowsResponseValues,
  SingleMultiSelectionPerRowCondition,
} from 'shared/state/Applet';

import { checkIfSelectionsHaveIntersections } from './checkIfSelectionsHaveIntersections';
import {
  CheckIfSelectionsHaveIntersectionsProps,
  GroupedConditionsByRow,
} from './checkIfSelectionsHaveIntersections.types';

export const checkIfSelectionsPerRowHaveIntersections = <
  T extends SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
  isSingleSelect,
}: CheckIfSelectionsHaveIntersectionsProps) => {
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

  return Object.entries(groupedConditionsByRow).some((entity) => {
    const responseValues = entity[1]?.[0]
      ?.responseValues as SingleAndMultipleSelectRowsResponseValues;

    return checkIfSelectionsHaveIntersections({
      conditions: entity[1],
      sameOptionValue,
      inverseOptionValue,
      isSingleSelect,
      optionsLength: responseValues?.options?.length,
    });
  });
};
