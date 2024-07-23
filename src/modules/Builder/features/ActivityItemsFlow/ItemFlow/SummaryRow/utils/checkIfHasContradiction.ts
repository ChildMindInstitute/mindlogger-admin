import {
  ConditionType,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  ItemResponseType,
} from 'shared/consts';
import {
  NumberItemResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
} from 'shared/state/Applet';

import { ConditionWithSetType } from '../SummaryRow.types';
import { getObjectFromListByItemId } from './getMatchOptions/getObjectFromListByItemId';
import { checkIfItemsHaveIntersections } from './checkIfItemsHaveIntersections';
import { convertToMinutes } from './convertToMinutes';
import { checkIfSelectionsHaveIntersections } from './checkIfSelectionsHasIntersection/checkIfSelectionsHaveIntersections';
import { checkIfSelectionsPerRowHaveIntersections } from './checkIfSelectionsHasIntersection/checkIfSelectionsPerRowHaveIntersections';

export const checkIfHasContradiction = (
  conditionsByItemId: ReturnType<typeof getObjectFromListByItemId>,
) => {
  const groupedItemsByItemId = Object.entries(conditionsByItemId);

  return groupedItemsByItemId.some((entity) => {
    const responseType = entity[1].itemType;
    const groupedConditions = entity[1].conditions;

    switch (responseType) {
      case ItemResponseType.Slider:
      case ItemResponseType.NumberSelection: {
        const responseValues = groupedConditions?.[0]?.responseValues as
          | SliderItemResponseValues
          | NumberItemResponseValues;

        return checkIfItemsHaveIntersections({
          responseType,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: responseValues.minValue as number,
          maxValue: responseValues.maxValue as number,
        });
      }
      case ItemResponseType.Time: {
        return checkIfItemsHaveIntersections({
          responseType,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: convertToMinutes(DEFAULT_START_TIME) || 0,
          maxValue: convertToMinutes(DEFAULT_END_TIME) || 0,
        });
      }
      case ItemResponseType.Date: {
        return checkIfItemsHaveIntersections({
          responseType,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: 0,
          maxValue: Number.MAX_SAFE_INTEGER,
        });
      }
      case ItemResponseType.TimeRange: {
        return checkIfItemsHaveIntersections({
          responseType,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: convertToMinutes(DEFAULT_START_TIME) || 0,
          maxValue: convertToMinutes(DEFAULT_END_TIME) || 0,
        });
      }
      case ItemResponseType.SliderRows: {
        const responseValues = groupedConditions?.[0]?.responseValues as SliderRowsResponseValues;

        return checkIfItemsHaveIntersections({
          responseType,
          conditions: groupedConditions as ConditionWithSetType[],
          sliderRows: responseValues?.rows,
        });
      }
      case ItemResponseType.SingleSelection: {
        const responseValues = groupedConditions?.[0]
          ?.responseValues as SingleAndMultipleSelectItemResponseValues;

        return checkIfSelectionsHaveIntersections({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
          optionsLength: responseValues?.options?.length,
          isSingleSelect: true,
        });
      }
      case ItemResponseType.SingleSelectionPerRow:
        return checkIfSelectionsPerRowHaveIntersections({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
          isSingleSelect: true,
        });
      case ItemResponseType.MultipleSelection: {
        const responseValues = groupedConditions?.[0]
          ?.responseValues as SingleAndMultipleSelectItemResponseValues;

        return checkIfSelectionsHaveIntersections({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
          optionsLength: responseValues?.options?.length,
          noneAboveId: responseValues?.options?.find((option) => option?.isNoneAbove)?.id,
        });
      }
      case ItemResponseType.MultipleSelectionPerRow:
        return checkIfSelectionsPerRowHaveIntersections({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      default:
        return false;
    }
  });
};
