import i18n from 'i18n';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import {
  Condition,
  OptionCondition,
  SingleValueCondition,
  RangeValueCondition,
  SingleAndMultipleSelectItemResponseValues,
  ScoreReport,
  SliderItemResponseValues,
} from 'shared/state';

import { DEFAULT_PAYLOAD_MIN_VALUE, DEFAULT_PAYLOAD_MAX_VALUE } from './ConditionRow.const';
import { OptionListItem } from './ConditionRow.types';
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
    default:
      return ConditionItemType.SingleSelection;
  }
};

export const getItemOptions = (items: ItemFormValues[], conditionRowType: ConditionRowType) =>
  items?.reduce((optionList: OptionListItem[], item) => {
    if (
      item.responseType === ItemResponseType.Slider ||
      item.responseType === ItemResponseType.SingleSelection ||
      item.responseType === ItemResponseType.MultipleSelection
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

export const getPayload = (
  conditionType: ConditionType,
  conditionPayload?: Condition['payload'],
  selectedItem?: ItemFormValues,
) => {
  switch (conditionType) {
    case ConditionType.IncludesOption:
    case ConditionType.NotIncludesOption:
    case ConditionType.EqualToOption:
    case ConditionType.NotEqualToOption:
      return {
        optionValue: (conditionPayload as OptionCondition['payload'])?.optionValue ?? '',
      };
    case ConditionType.GreaterThan:
      if (selectedItem?.responseType === ItemResponseType.Slider) {
        return {
          value: (selectedItem.responseValues as SliderItemResponseValues).minValue,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.LessThan:
      if (selectedItem?.responseType === ItemResponseType.Slider) {
        return {
          value: (selectedItem.responseValues as SliderItemResponseValues).maxValue,
        };
      }

      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.Equal:
    case ConditionType.NotEqual:
      return getDefaultPayload(conditionPayload as SingleValueCondition['payload']);
    case ConditionType.Between:
    case ConditionType.OutsideOf:
      if (selectedItem?.responseType === ItemResponseType.Slider) {
        return {
          minValue: (selectedItem.responseValues as SliderItemResponseValues).minValue,
          maxValue: (selectedItem.responseValues as SliderItemResponseValues).maxValue,
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
  const responseValues = item?.responseValues as SingleAndMultipleSelectItemResponseValues;

  if (!responseValues?.options) return [];

  return responseValues.options.map(({ id, text }) => ({
    value: id,
    labelKey: text,
  }));
};
