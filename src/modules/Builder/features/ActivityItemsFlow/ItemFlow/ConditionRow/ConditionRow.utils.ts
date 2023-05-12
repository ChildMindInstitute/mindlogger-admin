import i18n from 'i18n';
import { ItemFormValues } from 'modules/Builder/pages';
import { ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import {
  Condition,
  OptionCondition,
  SingleValueCondition,
  RangeValueCondition,
  SingleAndMultipleSelectItemResponseValues,
} from 'shared/state';

import { DEFAULT_PAYLOAD_MIN_VALUE, DEFAULT_PAYLOAD_MAX_VALUE } from './ConditionRow.const';

const { t } = i18n;

export const getItemNameOptionsList = (items: ItemFormValues[]) =>
  items?.reduce((optionList: { labelKey: string; value: string }[], item) => {
    if (
      item.responseType === ItemResponseType.Slider ||
      item.responseType === ItemResponseType.SingleSelection ||
      item.responseType === ItemResponseType.MultipleSelection
    ) {
      return [...optionList, { labelKey: item.name, value: getEntityKey(item) }];
    }

    return optionList;
  }, []);

export const getTypeOptionsList = (responseType: ItemResponseType) => {
  switch (responseType) {
    case ItemResponseType.SingleSelection:
      return [
        { value: ConditionType.EqualToOption, labelKey: t('equalToOption') },
        { value: ConditionType.NotEqualToOption, labelKey: t('notEqualToOption') },
      ];
    case ItemResponseType.MultipleSelection:
      return [
        { value: ConditionType.IncludesOption, labelKey: t('includesOption') },
        { value: ConditionType.NotIncludesOption, labelKey: t('notIncludesOption') },
      ];
    case ItemResponseType.Slider:
      return [
        { value: ConditionType.GreaterThan, labelKey: t('greaterThan') },
        { value: ConditionType.LessThan, labelKey: t('lessThan') },
        { value: ConditionType.Equal, labelKey: t('equal') },
        { value: ConditionType.NotEqual, labelKey: t('notEqual') },
        { value: ConditionType.Between, labelKey: t('between') },
        { value: ConditionType.OutsideOf, labelKey: t('outsideOf') },
      ];
    default:
      return [];
  }
};

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
