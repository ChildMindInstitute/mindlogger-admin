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
import { ConditionItemType } from '../../Condition/Condition.const';

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

export const getItemOptions = (items: ItemFormValues[]) =>
  items?.reduce(
    (optionList: { labelKey: string; value: string; type: ConditionItemType }[], item) => {
      if (
        item.responseType === ItemResponseType.Slider ||
        item.responseType === ItemResponseType.SingleSelection ||
        item.responseType === ItemResponseType.MultipleSelection
      ) {
        return [
          ...optionList,
          {
            labelKey: item.name,
            value: getEntityKey(item),
            type: getConditionItemType(item),
          },
        ];
      }

      return optionList;
    },
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
