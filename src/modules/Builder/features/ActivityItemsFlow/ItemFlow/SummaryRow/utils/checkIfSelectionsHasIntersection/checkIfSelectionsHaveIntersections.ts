import { OptionCondition, SingleMultiSelectionPerRowCondition } from 'shared/state/Applet';

import { CheckIfSelectionsHaveIntersectionsProps } from './checkIfSelectionsHaveIntersections.types';

export const checkIfSelectionsHaveIntersections = <
  T extends OptionCondition | SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
  optionsLength,
  noneAboveId,
  isSingleSelect,
}: CheckIfSelectionsHaveIntersectionsProps) => {
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

  const sameOptionValuesArray = [...sameOptionValues].filter(Boolean);
  const inverseOptionValuesArray = [...inverseOptionValues].filter(Boolean);

  const intersect = sameOptionValuesArray.filter((item) => inverseOptionValues.has(item));

  if (
    // intersection between "equal/not equal" and "includes/doesn't include" options exists
    intersect.length > 0 ||
    // for Single Selection or Single Selection Per Row: more than one "equal" option is selected
    (isSingleSelect && sameOptionValuesArray.length > 1) ||
    // for Single/Multiple Selection or Single/Multiple Selection Per Row: all "not equal/doesn't include" options are selected simultaneously
    (optionsLength && optionsLength > 1 && inverseOptionValuesArray.length === optionsLength) ||
    // for Multiple Selection: both "none" option and other options are selected simultaneously
    (noneAboveId &&
      sameOptionValuesArray.length > 1 &&
      sameOptionValuesArray.some((value) => value === noneAboveId))
  ) {
    return true;
  }

  return false;
};
