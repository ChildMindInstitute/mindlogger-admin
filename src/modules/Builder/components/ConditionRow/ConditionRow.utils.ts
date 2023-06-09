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
  ActivitySettingsScore,
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
        },
      ];
    }

    return optionList;
  }, []);

export const getScoreOptions = (scores: ActivitySettingsScore[]) =>
  scores?.map((score) => ({
    labelKey: `${t('score')}: ${score.name}`,
    value: getEntityKey(score),
    type: ConditionItemType.Score,
  }));

export const getScoreIdOption = (scoreId: string) => ({
  labelKey: `${t('score')}: ${scoreId}`,
  value: scoreId,
  type: ConditionItemType.Score,
});

export const getScoreConditionalsOptions = (scores: ActivitySettingsScore[]) =>
  scores?.reduce(
    (scoreConditionals: OptionListItem[], score: ActivitySettingsScore) => [
      ...scoreConditionals,
      ...(score.conditionalLogic?.map((conditional) => ({
        labelKey: `${t('scoreConditionals')}: ${conditional.name}`,
        value: getEntityKey(conditional),
        type: ConditionItemType.ScoreCondition,
      })) || []),
    ],
    [],
  );

export const getPayload = (
  conditionType: ConditionType,
  conditionPayload?: Condition['payload'],
) => {
  switch (conditionType) {
    case ConditionType.IncludesOption:
    case ConditionType.NotIncludesOption:
    case ConditionType.EqualToOption:
    case ConditionType.NotEqualToOption:
      return {
        optionId: (conditionPayload as OptionCondition['payload'])?.optionId ?? '',
      };
    case ConditionType.GreaterThan:
    case ConditionType.LessThan:
    case ConditionType.Equal:
    case ConditionType.NotEqual:
      return {
        value:
          (conditionPayload as SingleValueCondition['payload'])?.value ?? DEFAULT_PAYLOAD_MIN_VALUE,
      };
    case ConditionType.Between:
    case ConditionType.OutsideOf:
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
