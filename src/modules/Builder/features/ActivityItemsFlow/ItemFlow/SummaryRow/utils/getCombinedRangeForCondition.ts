import { ConditionType } from 'shared/consts';

import {
  CombinedConditionType,
  ConditionWithSetType,
  ResponseTypeForSetType,
} from '../SummaryRow.types';
import { getOutsideOfCombinedRange } from './getOutsideOfCombinedRange';
import { getBetweenCombinedRange } from './getBetweenCombinedRange';
import { getLessThanCombinedValue } from './getLessThanCombinedValue';
import { getGreaterThanCombinedValue } from './getGreaterThanCombinedValue';
import { getCombinedValueSet } from './getCombinedValueSet';

export const getCombinedRangeForCondition = (
  responseType: ResponseTypeForSetType,
  type: ConditionType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (type) {
    case ConditionType.OutsideOf:
      return getOutsideOfCombinedRange(responseType, conditions);
    case ConditionType.Between:
      return getBetweenCombinedRange(responseType, conditions);
    case ConditionType.LessThan:
      return getLessThanCombinedValue(responseType, conditions);
    case ConditionType.GreaterThan:
      return getGreaterThanCombinedValue(responseType, conditions);
    case ConditionType.Equal:
      return getCombinedValueSet(responseType, conditions);
    case ConditionType.NotEqual:
      return getCombinedValueSet(responseType, conditions);
  }
};
