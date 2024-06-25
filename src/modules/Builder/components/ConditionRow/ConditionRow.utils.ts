import i18n from 'i18n';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import {
  OptionCondition,
  SingleValueCondition,
  RangeValueCondition,
  ScoreReport,
  TimeRangeValueCondition,
  SingleMultiSelectionPerRowCondition,
} from 'shared/state';
import { SliderRowsCondition } from 'shared/state/Applet/Applet.schema';

import { DEFAULT_PAYLOAD_MIN_VALUE, DEFAULT_PAYLOAD_MAX_VALUE } from './ConditionRow.const';
import { GetPayload, OptionListItem } from './ConditionRow.types';
import { ConditionItemType } from './Condition';

const { t } = i18n;

export const getConditionItemType = (item: ItemFormValues) => {
  switch (item.responseType) {
    case ItemResponseType.Slider:
      return ConditionItemType.Slider;
    case ItemResponseType.SingleSelection:
      return ConditionItemType.SingleSelection;
    case ItemResponseType.MultipleSelection:
      return ConditionItemType.MultiSelection;
    case ItemResponseType.Date:
      return ConditionItemType.Date;
    case ItemResponseType.NumberSelection:
      return ConditionItemType.NumberSelection;
    case ItemResponseType.Time:
      return ConditionItemType.Time;
    case ItemResponseType.TimeRange:
      return ConditionItemType.TimeRange;
    case ItemResponseType.SingleSelectionPerRow:
      return ConditionItemType.SingleSelectionPerRow;
    case ItemResponseType.MultipleSelectionPerRow:
      return ConditionItemType.MultipleSelectionPerRow;
    case ItemResponseType.SliderRows:
      return ConditionItemType.SliderRows;
    default:
      return ConditionItemType.SingleSelection;
  }
};

const scoreItemTypes = [
  ItemResponseType.Slider,
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
];
const itemFlowItemTypes = [
  ...scoreItemTypes,
  ItemResponseType.Date,
  ItemResponseType.NumberSelection,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SliderRows,
];
const checkIfShouldBeIncluded = (responseType: ItemResponseType, isItemFlow = false) =>
  (isItemFlow ? itemFlowItemTypes : scoreItemTypes).some((value) => value === responseType);

export const getItemOptions = (
  items: ItemFormValues[],
  conditionRowType: ConditionRowType,
  isItemFlow = false,
) =>
  items?.reduce((optionList: OptionListItem[], item) => {
    if (checkIfShouldBeIncluded(item.responseType, isItemFlow)) {
      return [
        ...optionList,
        {
          labelKey:
            conditionRowType === ConditionRowType.Item
              ? item.name
              : `${t('conditionItem')}: ${item.name}`,
          value: getEntityKey(item),
          type: getConditionItemType(item),
          responseValues: item.responseValues,
          question: item.question,
        },
      ];
    }

    return optionList;
  }, []) || [];

export const getScoreOptions = (scores: ScoreReport[]) =>
  scores?.map((score) => ({
    labelKey: `${t('score')}: ${score.name}`,
    value: score.key,
    type: ConditionItemType.Score,
  }));

export const getScoreIdOption = (score: ScoreReport) => ({
  labelKey: `${t('score')}: ${score?.id}`,
  value: getEntityKey(score, false),
  type: ConditionItemType.Score,
});

export const getScoreConditionalsOptions = (scores: ScoreReport[]) =>
  scores?.reduce(
    (scoreConditionals: OptionListItem[], score: ScoreReport) => [
      ...scoreConditionals,
      ...(score.conditionalLogic?.map((conditional) => ({
        labelKey: `${t('scoreConditionals')}: ${conditional.name}`,
        value: getEntityKey(conditional, false),
        type: ConditionItemType.ScoreCondition,
      })) || []),
    ],
    [],
  );

const getDefaultPayload = (
  conditionPayload: SingleValueCondition['payload'] | TimeRangeValueCondition['payload'],
  type?: ItemResponseType,
) => {
  let defaultValue: null | number = DEFAULT_PAYLOAD_MIN_VALUE;
  if (type === ItemResponseType.TimeRange)
    return {
      value: (conditionPayload as SingleValueCondition['payload'])?.value ?? null,
      type: (conditionPayload as TimeRangeValueCondition['payload'])?.type ?? null,
    };
  if (type === ItemResponseType.Date || type === ItemResponseType.Time) defaultValue = null;

  return {
    value: (conditionPayload as SingleValueCondition['payload'])?.value ?? defaultValue,
  };
};

export const getPayload = ({ conditionType, conditionPayload, selectedItem }: GetPayload) => {
  const responseType = selectedItem?.responseType;

  switch (conditionType) {
    case ConditionType.IncludesOption:
    case ConditionType.NotIncludesOption:
    case ConditionType.EqualToOption:
    case ConditionType.NotEqualToOption:
      if (
        responseType === ItemResponseType.SingleSelectionPerRow ||
        responseType === ItemResponseType.MultipleSelectionPerRow
      ) {
        return {
          optionValue:
            (conditionPayload as SingleMultiSelectionPerRowCondition['payload'])?.optionValue ?? '',
          rowIndex:
            (conditionPayload as SingleMultiSelectionPerRowCondition['payload'])?.rowIndex ?? '',
        };
      }

      return {
        optionValue: (conditionPayload as OptionCondition['payload'])?.optionValue ?? '',
      };
    case ConditionType.GreaterThan:
      if (
        responseType === ItemResponseType.Slider ||
        responseType === ItemResponseType.NumberSelection
      ) {
        return {
          value: selectedItem?.responseValues.minValue,
        };
      }
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition['payload'];
        const rowIndex = payload?.rowIndex ?? '';
        const minValue = rowIndex ? selectedItem?.responseValues.rows[rowIndex]?.minValue : '';

        return {
          value: minValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload'], responseType);
    case ConditionType.LessThan:
      if (
        responseType === ItemResponseType.Slider ||
        responseType === ItemResponseType.NumberSelection
      ) {
        return {
          value: selectedItem?.responseValues.maxValue,
        };
      }
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition['payload'];
        const rowIndex = payload?.rowIndex ?? '';
        const maxValue = rowIndex ? selectedItem?.responseValues.rows[rowIndex]?.maxValue : '';

        return {
          value: maxValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload'], responseType);
    case ConditionType.Equal:
    case ConditionType.NotEqual: {
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition['payload'];
        const rowIndex = payload?.rowIndex ?? '';
        const minValue = rowIndex ? selectedItem?.responseValues.rows[rowIndex]?.minValue : '';

        return {
          value: minValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload'], responseType);
    }
    case ConditionType.Between:
    case ConditionType.OutsideOf:
      if (
        responseType === ItemResponseType.Slider ||
        responseType === ItemResponseType.NumberSelection
      ) {
        return {
          minValue: selectedItem?.responseValues.minValue,
          maxValue: selectedItem?.responseValues.maxValue,
        };
      }
      if (responseType === ItemResponseType.Date || responseType === ItemResponseType.Time) {
        return {
          minValue: (conditionPayload as RangeValueCondition<Date>['payload'])?.minValue ?? null,
          maxValue: (conditionPayload as RangeValueCondition<Date>['payload'])?.maxValue ?? null,
        };
      }
      if (responseType === ItemResponseType.TimeRange) {
        return {
          minValue: (conditionPayload as TimeRangeValueCondition['payload'])?.minValue ?? null,
          maxValue: (conditionPayload as TimeRangeValueCondition['payload'])?.maxValue ?? null,
          type: (conditionPayload as TimeRangeValueCondition['payload'])?.type ?? null,
        };
      }
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition<RangeValueCondition>['payload'];
        const rowIndex = payload?.rowIndex ?? '';
        const { maxValue = '', minValue = '' } = rowIndex
          ? selectedItem?.responseValues.rows[rowIndex] ?? {}
          : {};

        return {
          maxValue,
          minValue,
          rowIndex,
        };
      }

      return {
        minValue:
          (conditionPayload as RangeValueCondition['payload'])?.minValue ??
          DEFAULT_PAYLOAD_MIN_VALUE,
        maxValue:
          (conditionPayload as RangeValueCondition['payload'])?.maxValue ??
          DEFAULT_PAYLOAD_MAX_VALUE,
      };
    default:
      return {};
  }
};

export const getValueOptionsList = (item: ItemFormValues) => {
  if (!item) return [];

  const { responseValues, responseType } = item;
  if (
    responseType !== ItemResponseType.SingleSelection &&
    responseType !== ItemResponseType.MultipleSelection &&
    responseType !== ItemResponseType.SingleSelectionPerRow &&
    responseType !== ItemResponseType.MultipleSelectionPerRow
  ) {
    return [];
  }

  return responseValues.options.map(({ id, text }) => ({
    value: id,
    labelKey: text,
  }));
};
