import i18n from 'i18n';
import { ConditionType, ScoreConditionType } from 'shared/consts';
import { SliderItemResponseValues } from 'shared/state';

import { ConditionItem } from './Condition.types';
import { ConditionItemType, DEFAULT_NUMBER_MIN_VALUE } from './Condition.const';

const { t } = i18n;

export const getStateOptions = (type?: ConditionItemType) => {
  switch (type) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider:
      return [
        { value: ConditionType.GreaterThan, labelKey: t('greaterThan') },
        { value: ConditionType.LessThan, labelKey: t('lessThan') },
        { value: ConditionType.Equal, labelKey: t('equal') },
        { value: ConditionType.NotEqual, labelKey: t('notEqual') },
        { value: ConditionType.Between, labelKey: t('between') },
        { value: ConditionType.OutsideOf, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.SingleSelection:
      return [
        { value: ConditionType.EqualToOption, labelKey: t('equalToOption') },
        { value: ConditionType.NotEqualToOption, labelKey: t('notEqualToOption') },
      ];
    case ConditionItemType.MultiSelection:
      return [
        { value: ConditionType.IncludesOption, labelKey: t('includesOption') },
        { value: ConditionType.NotIncludesOption, labelKey: t('notIncludesOption') },
      ];
    case ConditionItemType.ScoreCondition:
      return [{ value: ScoreConditionType, labelKey: t('equal') }];
    default:
      return [];
  }
};

export const getScoreConditionOptions = () => [
  {
    value: 'false',
    labelKey: t('false'),
  },
  {
    value: 'true',
    labelKey: t('true'),
  },
];

const getDefaultMinMaxValues = (state: ConditionType) => ({
  minNumber: state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE,
  maxNumber: undefined,
});
export const getConditionMinMaxValues = ({
  item,
  state,
}: {
  item?: ConditionItem;
  state: ConditionType;
}) => {
  if (!item?.type) return getDefaultMinMaxValues(state);

  switch (item.type) {
    case ConditionItemType.Slider:
      return {
        minNumber: state
          ? +(item.responseValues! as SliderItemResponseValues).minValue
          : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state
          ? +(item.responseValues! as SliderItemResponseValues).maxValue
          : Number.MAX_SAFE_INTEGER,
      };
    default:
      return getDefaultMinMaxValues(state);
  }
};

const getDefaultMinMaxRangeValues = () => ({
  leftRange: {
    minNumber: Number.MIN_SAFE_INTEGER,
    maxNumber: undefined,
  },
  rightRange: {
    minNumber: Number.MIN_SAFE_INTEGER,
    maxNumber: undefined,
  },
});
export const getConditionMinMaxRangeValues = ({
  item,
  minValue,
  maxValue,
}: {
  item?: ConditionItem;
  minValue: number;
  maxValue: number;
}) => {
  if (!item?.type) return getDefaultMinMaxRangeValues();

  switch (item.type) {
    case ConditionItemType.Slider:
      return {
        leftRange: {
          minNumber: +(item.responseValues! as SliderItemResponseValues).minValue,
          maxNumber: maxValue,
        },
        rightRange: {
          minNumber: minValue,
          maxNumber: +(item.responseValues! as SliderItemResponseValues).maxValue,
        },
      };
    default:
      return getDefaultMinMaxRangeValues();
  }
};
