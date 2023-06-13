import i18n from 'i18n';
import { ConditionType } from 'shared/consts';

import { ConditionItemType } from './Condition.const';

export const getStateOptions = (type?: ConditionItemType) => {
  const { t } = i18n;

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
      return [{ value: ConditionType.Equal, labelKey: t('equal') }];
    default:
      return [];
  }
};
