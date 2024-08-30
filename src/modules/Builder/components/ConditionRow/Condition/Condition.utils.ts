import i18n from 'i18n';
import { ConditionType, ScoreConditionType } from 'shared/consts';

import { ConditionItemType } from './Condition.const';

const { t } = i18n;

export const getStateOptions = (type?: ConditionItemType) => {
  switch (type) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider:
    case ConditionItemType.NumberSelection:
      return [
        { value: ConditionType.GreaterThan, labelKey: t('greaterThan') },
        { value: ConditionType.LessThan, labelKey: t('lessThan') },
        { value: ConditionType.Equal, labelKey: t('equal') },
        { value: ConditionType.NotEqual, labelKey: t('notEqual') },
        { value: ConditionType.Between, labelKey: t('between') },
        { value: ConditionType.OutsideOf, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.Date:
      return [
        { value: ConditionType.GreaterThanDate, labelKey: t('greaterThan') },
        { value: ConditionType.LessThanDate, labelKey: t('lessThan') },
        { value: ConditionType.EqualToDate, labelKey: t('equal') },
        { value: ConditionType.NotEqualToDate, labelKey: t('notEqual') },
        { value: ConditionType.BetweenDates, labelKey: t('between') },
        { value: ConditionType.OutsideOfDates, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.Time:
      return [
        { value: ConditionType.GreaterThanTime, labelKey: t('greaterThan') },
        { value: ConditionType.LessThanTime, labelKey: t('lessThan') },
        { value: ConditionType.EqualToTime, labelKey: t('equal') },
        { value: ConditionType.NotEqualToTime, labelKey: t('notEqual') },
        { value: ConditionType.BetweenTimes, labelKey: t('between') },
        { value: ConditionType.OutsideOfTimes, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.TimeRange:
      return [
        { value: ConditionType.GreaterThanTimeRange, labelKey: t('greaterThan') },
        { value: ConditionType.LessThanTimeRange, labelKey: t('lessThan') },
        { value: ConditionType.EqualToTimeRange, labelKey: t('equal') },
        { value: ConditionType.NotEqualToTimeRange, labelKey: t('notEqual') },
        { value: ConditionType.BetweenTimesRange, labelKey: t('between') },
        { value: ConditionType.OutsideOfTimesRange, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.SliderRows:
      return [
        { value: ConditionType.GreaterThanSliderRows, labelKey: t('greaterThan') },
        { value: ConditionType.LessThanSliderRows, labelKey: t('lessThan') },
        { value: ConditionType.EqualToSliderRows, labelKey: t('equal') },
        { value: ConditionType.NotEqualToSliderRows, labelKey: t('notEqual') },
        { value: ConditionType.BetweenSliderRows, labelKey: t('between') },
        { value: ConditionType.OutsideOfSliderRows, labelKey: t('outsideOf') },
      ];
    case ConditionItemType.SingleSelection:
      return [
        { value: ConditionType.EqualToOption, labelKey: t('equalToOption') },
        { value: ConditionType.NotEqualToOption, labelKey: t('notEqualToOption') },
      ];
    case ConditionItemType.SingleSelectionPerRow:
      return [
        { value: ConditionType.EqualToRowOption, labelKey: t('equalToOption') },
        { value: ConditionType.NotEqualToRowOption, labelKey: t('notEqualToOption') },
      ];
    case ConditionItemType.MultiSelection:
      return [
        { value: ConditionType.IncludesOption, labelKey: t('includesOption') },
        { value: ConditionType.NotIncludesOption, labelKey: t('notIncludesOption') },
      ];
    case ConditionItemType.MultipleSelectionPerRow:
      return [
        { value: ConditionType.IncludesRowOption, labelKey: t('includesOption') },
        { value: ConditionType.NotIncludesRowOption, labelKey: t('notIncludesOption') },
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
