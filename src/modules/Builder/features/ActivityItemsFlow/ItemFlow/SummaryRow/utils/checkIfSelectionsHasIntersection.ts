import { OptionCondition, SingleMultiSelectionPerRowCondition } from 'shared/state/Applet';

import { CheckIfSelectionsIntersectionProps } from '../SummaryRow.types';

export const checkIfSelectionsHasIntersection = <
  T extends OptionCondition | SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const sameOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === sameOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const inverseOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === inverseOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const intersect = [...sameOptionValues].filter((i) => inverseOptionValues.has(i));
  if (intersect.length > 0) return true;

  return false;
};
