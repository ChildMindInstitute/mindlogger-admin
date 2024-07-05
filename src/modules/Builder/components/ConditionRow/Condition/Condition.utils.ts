import i18n from 'i18n';
import { ConditionType, ScoreConditionType } from 'shared/consts';

import { ConditionItemType } from './Condition.const';

const { t } = i18n;

export const getStateOptions = (type?: ConditionItemType) => {
  switch (type) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider:
    case ConditionItemType.Date:
    case ConditionItemType.NumberSelection:
    case ConditionItemType.Time:
    case ConditionItemType.TimeRange:
    case ConditionItemType.SliderRows:
      return [
        { value: ConditionType.GreaterThan, labelKey: t('greaterThan') },
        { value: ConditionType.LessThan, labelKey: t('lessThan') },
        { value: ConditionType.Equal, labelKey: t('equal') },
        { value: ConditionType.NotEqual, labelKey: t('notEqual') },
        { value: ConditionType.Between, labelKey: t('between') },
        { value: ConditionType.OutsideOf, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.SingleSelection:
    case ConditionItemType.SingleSelectionPerRow:
      return [
        { value: ConditionType.EqualToOption, labelKey: t('equalToOption') },
        { value: ConditionType.NotEqualToOption, labelKey: t('notEqualToOption') },
      ];
    case ConditionItemType.MultiSelection:
    case ConditionItemType.MultipleSelectionPerRow:
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
