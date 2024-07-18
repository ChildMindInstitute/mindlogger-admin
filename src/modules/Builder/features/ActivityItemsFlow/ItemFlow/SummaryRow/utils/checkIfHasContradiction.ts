import {
  ConditionType,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  ItemResponseType,
} from 'shared/consts';
import { NumberItemResponseValues, SliderItemResponseValues } from 'shared/state/Applet';

import { ConditionWithSetType } from '../SummaryRow.types';
import { getObjectFromListByItemId } from './getObjectFromListByItemId';
import { getCombinedConditionsByType } from './getCombinedConditionsByType';
import { convertToMinutes } from './convertToMinutes';
import { checkIfSelectionsHasIntersection } from './checkIfSelectionsHasIntersection';
import { checkIfSelectionPerRowHasIntersection } from './checkIfSelectionPerRowHasIntersection';

export const checkIfHasContradiction = (
  conditionsByItemId: ReturnType<typeof getObjectFromListByItemId>,
) => {
  const groupedItemsByItemId = Object.entries(conditionsByItemId);

  return groupedItemsByItemId.some((entity) => {
    const type = entity[1].itemType;
    const groupedConditions = entity[1].conditions;

    switch (type) {
      case ItemResponseType.Slider:
      case ItemResponseType.NumberSelection: {
        const responseValues = groupedConditions[0].responseValues as
          | SliderItemResponseValues
          | NumberItemResponseValues;

        return getCombinedConditionsByType({
          responseType: type,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: responseValues.minValue as number,
          maxValue: responseValues.maxValue as number,
        });
      }
      case ItemResponseType.Time: {
        return getCombinedConditionsByType({
          responseType: type,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: convertToMinutes(DEFAULT_START_TIME) || 0,
          maxValue: convertToMinutes(DEFAULT_END_TIME) || 0,
        });
      }
      case ItemResponseType.Date: {
        return getCombinedConditionsByType({
          responseType: type,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: 0,
          maxValue: Number.MAX_SAFE_INTEGER,
        });
      }
      case ItemResponseType.TimeRange:
      case ItemResponseType.SliderRows: {
        return false;
      }
      case ItemResponseType.SingleSelection:
        return checkIfSelectionsHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });

      case ItemResponseType.SingleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });
      case ItemResponseType.MultipleSelection:
        return checkIfSelectionsHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      case ItemResponseType.MultipleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      default:
        return false;
    }
  });
};
