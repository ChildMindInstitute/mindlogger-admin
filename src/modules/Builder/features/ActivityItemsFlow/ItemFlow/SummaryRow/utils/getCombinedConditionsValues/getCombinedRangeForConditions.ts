import { ConditionType } from 'shared/consts';

import {
  CombinedConditionType,
  ConditionWithSetType,
  ResponseTypeForSetType,
} from '../../SummaryRow.types';
import { getOutsideOfCombinedRange } from './getOutsideOfCombinedRange';
import { getBetweenCombinedRange } from './getBetweenCombinedRange';
import { getLessThanCombinedValue } from './getLessThanCombinedValue';
import { getGreaterThanCombinedValue } from './getGreaterThanCombinedValue';
import { getCombinedValueSet } from './getCombinedValueSet';

export const getCombinedRangeForConditions = (
  responseType: ResponseTypeForSetType,
  type: ConditionType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (type) {
    case ConditionType.OutsideOf:
    case ConditionType.OutsideOfDates:
    case ConditionType.OutsideOfTimes:
    case ConditionType.OutsideOfTimesRange:
    case ConditionType.OutsideOfSliderRows:
      return getOutsideOfCombinedRange(responseType, conditions);
    case ConditionType.Between:
    case ConditionType.BetweenDates:
    case ConditionType.BetweenTimes:
    case ConditionType.BetweenTimesRange:
    case ConditionType.BetweenSliderRows:
      return getBetweenCombinedRange(responseType, conditions);
    case ConditionType.LessThan:
    case ConditionType.LessThanDate:
    case ConditionType.LessThanTime:
    case ConditionType.LessThanTimeRange:
    case ConditionType.LessThanSliderRows:
      return getLessThanCombinedValue(responseType, conditions);
    case ConditionType.GreaterThan:
    case ConditionType.GreaterThanDate:
    case ConditionType.GreaterThanTime:
    case ConditionType.GreaterThanTimeRange:
    case ConditionType.GreaterThanSliderRows:
      return getGreaterThanCombinedValue(responseType, conditions);
    case ConditionType.Equal:
    case ConditionType.EqualToDate:
    case ConditionType.EqualToTime:
    case ConditionType.EqualToTimeRange:
    case ConditionType.EqualToSliderRows:
      return getCombinedValueSet(responseType, conditions);
    case ConditionType.NotEqual:
    case ConditionType.NotEqualToDate:
    case ConditionType.NotEqualToTime:
    case ConditionType.NotEqualToTimeRange:
    case ConditionType.NotEqualToSliderRows:
      return getCombinedValueSet(responseType, conditions);
  }
};
