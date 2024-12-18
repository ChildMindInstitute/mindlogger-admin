import i18n from 'i18n';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { getEntityKey } from 'shared/utils/getEntityKey';
import {
  DateRangeValueCondition,
  OptionCondition,
  RangeValueCondition,
  ScoreReport,
  SingleMultiSelectionPerRowCondition,
  SliderRowsCondition,
  TimeIntervalValueCondition,
  TimeRangeIntervalValueCondition,
  TimeRangeSingleValueCondition,
} from 'shared/state/Applet';

import { DEFAULT_PAYLOAD_MAX_VALUE, DEFAULT_PAYLOAD_MIN_VALUE } from './ConditionRow.const';
import {
  GetPayload,
  OptionListItem,
  PropertyName,
  SingleValueConditionPayload,
} from './ConditionRow.types';
import { ConditionItemType } from './Condition';
import { StyledMdPreview } from '../ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';

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

const itemFlowItemGroups = [
  [...scoreItemTypes, ItemResponseType.NumberSelection], // Group 1
  [ItemResponseType.Date, ItemResponseType.Time, ItemResponseType.TimeRange], // Group 2
  [
    ItemResponseType.SingleSelectionPerRow,
    ItemResponseType.MultipleSelectionPerRow,
    ItemResponseType.SliderRows,
  ], // Group 3
];

function getItemsSubset(includeGroup2: boolean, includeGroup3: boolean) {
  let subset = itemFlowItemGroups[0];

  if (includeGroup2) subset = [...subset, ...itemFlowItemGroups[1]];
  if (includeGroup3) subset = [...subset, ...itemFlowItemGroups[2]];

  return subset;
}

const checkIfShouldBeIncluded = (
  responseType: ItemResponseType,
  isItemFlow = false,
  group2 = false,
  group3 = false,
) =>
  (isItemFlow ? getItemsSubset(group2, group3) : scoreItemTypes).some(
    (value) => value === responseType,
  );

export const getItemOptions = (
  items: ItemFormValues[],
  conditionRowType: ConditionRowType,
  isItemFlow = false,
  enableItemFlowItemsG2 = false,
  enableItemFlowItemsG3 = false,
) =>
  items?.reduce((optionList: OptionListItem[], item) => {
    if (
      checkIfShouldBeIncluded(
        item.responseType,
        isItemFlow,
        enableItemFlowItemsG2,
        enableItemFlowItemsG3,
      )
    ) {
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
          tooltip: <StyledMdPreview modelValue={item.question ?? ''} />,
          tooltipPlacement: 'right',
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
  conditionPayload: SingleValueConditionPayload,
  type?: ItemResponseType,
) => {
  const defaultValue =
    type === ItemResponseType.Date || type === ItemResponseType.Time
      ? null
      : DEFAULT_PAYLOAD_MIN_VALUE;

  switch (type) {
    case ItemResponseType.Date:
      if (PropertyName.Date in conditionPayload) {
        return { date: conditionPayload.date ?? defaultValue };
      }

      return { date: defaultValue };
    case ItemResponseType.Time:
      if (PropertyName.Time in conditionPayload) {
        return { time: conditionPayload.time ?? defaultValue };
      }

      return { time: defaultValue };
    default:
      if (PropertyName.Value in conditionPayload) {
        return { value: conditionPayload.value ?? defaultValue };
      }

      return { value: defaultValue };
  }
};

export const getPayload = ({
  conditionType,
  conditionPayload,
  selectedItem,
  formRowIndex,
  formTimeType,
}: GetPayload) => {
  const responseType = selectedItem?.responseType;

  switch (conditionType) {
    case ConditionType.IncludesOption:
    case ConditionType.NotIncludesOption:
    case ConditionType.EqualToOption:
    case ConditionType.NotEqualToOption:
    case ConditionType.IncludesRowOption:
    case ConditionType.NotIncludesRowOption:
    case ConditionType.EqualToRowOption:
    case ConditionType.NotEqualToRowOption:
      if (
        responseType === ItemResponseType.SingleSelectionPerRow ||
        responseType === ItemResponseType.MultipleSelectionPerRow
      ) {
        return {
          optionValue:
            (conditionPayload as SingleMultiSelectionPerRowCondition['payload'])?.optionValue ?? '',
          rowIndex:
            formRowIndex ??
            (conditionPayload as SingleMultiSelectionPerRowCondition['payload'])?.rowIndex ??
            '',
        };
      }

      return {
        optionValue: (conditionPayload as OptionCondition['payload'])?.optionValue ?? '',
      };
    case ConditionType.GreaterThan:
    case ConditionType.GreaterThanDate:
    case ConditionType.GreaterThanTime:
    case ConditionType.GreaterThanSliderRows:
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
        const rowIndex = formRowIndex ?? payload?.rowIndex ?? '';
        const minValue = rowIndex ? selectedItem?.responseValues.rows[+rowIndex]?.minValue : '';

        return {
          value: minValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueConditionPayload, responseType);
    case ConditionType.LessThan:
    case ConditionType.LessThanDate:
    case ConditionType.LessThanTime:
    case ConditionType.LessThanSliderRows:
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
        const rowIndex = formRowIndex ?? payload?.rowIndex ?? '';
        const maxValue = rowIndex ? selectedItem?.responseValues.rows[+rowIndex]?.maxValue : '';

        return {
          value: maxValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueConditionPayload, responseType);
    case ConditionType.Equal:
    case ConditionType.EqualToDate:
    case ConditionType.EqualToTime:
    case ConditionType.EqualToSliderRows:
    case ConditionType.NotEqual:
    case ConditionType.NotEqualToDate:
    case ConditionType.NotEqualToTime:
    case ConditionType.NotEqualToSliderRows: {
      if (
        responseType === ItemResponseType.Slider ||
        responseType === ItemResponseType.NumberSelection
      ) {
        return {
          value: selectedItem?.responseValues?.minValue ?? DEFAULT_PAYLOAD_MIN_VALUE,
        };
      }
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition['payload'];
        const rowIndex = formRowIndex ?? payload?.rowIndex ?? '';
        const minValue = rowIndex ? selectedItem?.responseValues.rows[+rowIndex]?.minValue : '';

        return {
          value: minValue,
          rowIndex,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueConditionPayload, responseType);
    }
    case ConditionType.BetweenDates:
    case ConditionType.OutsideOfDates:
      return {
        minDate: (conditionPayload as DateRangeValueCondition['payload'])?.minDate ?? null,
        maxDate: (conditionPayload as DateRangeValueCondition['payload'])?.maxDate ?? null,
      };
    case ConditionType.BetweenTimes:
    case ConditionType.OutsideOfTimes:
      return {
        minTime: (conditionPayload as TimeIntervalValueCondition['payload'])?.minTime ?? null,
        maxTime: (conditionPayload as TimeIntervalValueCondition['payload'])?.maxTime ?? null,
      };
    case ConditionType.GreaterThanTimeRange:
    case ConditionType.LessThanTimeRange:
    case ConditionType.EqualToTimeRange:
    case ConditionType.NotEqualToTimeRange:
      return {
        time: (conditionPayload as TimeRangeSingleValueCondition['payload'])?.time ?? null,
        fieldName:
          formTimeType ??
          (conditionPayload as TimeRangeSingleValueCondition['payload'])?.fieldName ??
          null,
      };
    case ConditionType.BetweenTimesRange:
    case ConditionType.OutsideOfTimesRange:
      return {
        minTime: (conditionPayload as TimeRangeIntervalValueCondition['payload'])?.minTime ?? null,
        maxTime: (conditionPayload as TimeRangeIntervalValueCondition['payload'])?.maxTime ?? null,
        fieldName:
          formTimeType ??
          (conditionPayload as TimeRangeIntervalValueCondition['payload'])?.fieldName ??
          null,
      };
    case ConditionType.Between:
    case ConditionType.BetweenSliderRows:
    case ConditionType.OutsideOf:
    case ConditionType.OutsideOfSliderRows:
      if (
        responseType === ItemResponseType.Slider ||
        responseType === ItemResponseType.NumberSelection
      ) {
        return {
          minValue: selectedItem?.responseValues.minValue,
          maxValue: selectedItem?.responseValues.maxValue,
        };
      }
      if (responseType === ItemResponseType.SliderRows) {
        const payload = conditionPayload as SliderRowsCondition<RangeValueCondition>['payload'];
        const rowIndex = formRowIndex ?? payload?.rowIndex ?? '';
        const { maxValue = '', minValue = '' } = rowIndex
          ? selectedItem?.responseValues.rows[+rowIndex] ?? {}
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
