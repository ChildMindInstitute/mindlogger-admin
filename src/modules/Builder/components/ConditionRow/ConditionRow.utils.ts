import i18n from 'i18n';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import {
  OptionCondition,
  SingleValueCondition,
  RangeValueCondition,
  ScoreReport,
} from 'shared/state';

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

const getDefaultPayload = (conditionPayload: SingleValueCondition['payload']) => ({
  value: conditionPayload?.value ?? DEFAULT_PAYLOAD_MIN_VALUE,
});

export const getPayload = ({ conditionType, conditionPayload, selectedItem }: GetPayload) => {
  switch (conditionType) {
    case ConditionType.IncludesOption:
    case ConditionType.NotIncludesOption:
    case ConditionType.EqualToOption:
    case ConditionType.NotEqualToOption:
      return {
        optionValue: (conditionPayload as OptionCondition['payload'])?.optionValue ?? '',
      };
    case ConditionType.GreaterThan:
      if (
        selectedItem?.responseType === ItemResponseType.Slider ||
        selectedItem?.responseType === ItemResponseType.NumberSelection
      ) {
        return {
          value: selectedItem.responseValues.minValue,
        };
      }
      if (selectedItem?.responseType === ItemResponseType.Date) {
        return {
          value: null,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.LessThan:
      if (
        selectedItem?.responseType === ItemResponseType.Slider ||
        selectedItem?.responseType === ItemResponseType.NumberSelection
      ) {
        return {
          value: selectedItem.responseValues.maxValue,
        };
      }
      if (selectedItem?.responseType === ItemResponseType.Date) {
        return {
          value: null,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.Equal:
    case ConditionType.NotEqual:
      if (selectedItem?.responseType === ItemResponseType.Date) {
        return {
          value: null, // update with getDefaultPayload(isNullUsedAsDefault) + trigger validation
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.Between:
    case ConditionType.OutsideOf:
      if (
        selectedItem?.responseType === ItemResponseType.Slider ||
        selectedItem?.responseType === ItemResponseType.NumberSelection
      ) {
        return {
          minValue: selectedItem.responseValues.minValue,
          maxValue: selectedItem.responseValues.maxValue,
        };
      }
      if (selectedItem?.responseType === ItemResponseType.Date) {
        return {
          minValue: null,
          maxValue: null,
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
