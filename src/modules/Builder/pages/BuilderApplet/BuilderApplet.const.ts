import { ConditionType, ItemResponseType } from 'shared/consts';
import { CorrectPress } from 'modules/Builder/types';

export const CONDITION_TYPES_TO_HAVE_OPTION_ID = [
  ConditionType.IncludesOption,
  ConditionType.NotIncludesOption,
  ConditionType.EqualToOption,
  ConditionType.NotEqualToOption,
  ConditionType.EqualToRowOption,
  ConditionType.NotEqualToRowOption,
  ConditionType.IncludesRowOption,
  ConditionType.NotIncludesRowOption,
];

export const TIME_SINGLE_CONDITION_TYPES = [
  ConditionType.GreaterThanTime,
  ConditionType.LessThanTime,
  ConditionType.EqualToTime,
  ConditionType.NotEqualToTime,
  ConditionType.GreaterThanTimeRange,
  ConditionType.LessThanTimeRange,
  ConditionType.EqualToTimeRange,
  ConditionType.NotEqualToTimeRange,
];
export const TIME_INTERVAL_CONDITION_TYPES = [
  ConditionType.BetweenTimes,
  ConditionType.OutsideOfTimes,
  ConditionType.BetweenTimesRange,
  ConditionType.OutsideOfTimesRange,
];
export const DATE_SINGLE_CONDITION_TYPES = [
  ConditionType.GreaterThanDate,
  ConditionType.LessThanDate,
  ConditionType.EqualToDate,
  ConditionType.NotEqualToDate,
];
export const DATE_INTERVAL_CONDITION_TYPES = [
  ConditionType.BetweenDates,
  ConditionType.OutsideOfDates,
];
export const SLIDER_ROWS_CONDITION_TYPES = [
  ConditionType.GreaterThanSliderRows,
  ConditionType.LessThanSliderRows,
  ConditionType.EqualToSliderRows,
  ConditionType.NotEqualToSliderRows,
  ConditionType.BetweenSliderRows,
  ConditionType.OutsideOfSliderRows,
];

export const defaultFlankerBtnObj = { text: '', image: '', value: CorrectPress.Left };

export const SAMPLE_SIZE = 1;

export const ALLOWED_TYPES_IN_VARIABLES = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Date,
  ItemResponseType.NumberSelection,
  ItemResponseType.TimeRange,
  ItemResponseType.Text,
  ItemResponseType.ParagraphText,
];

export const ordinalStrings = ['First', 'Second', 'Third', 'Fourth'];

export const alphanumericAndHyphenRegexp = /^[a-zA-Z0-9_-]+$/g;

export const enum ItemTestFunctions {
  UniqueItemName = 'unique-item-name',
  ExistingNameInSystemItem = 'name-exists-in-system-items',
  VariableInTheSameItem = 'variable-in-the-same-item-error',
  VariableIsNotSupported = 'variable-is-not-supported-error',
  VariableReferringToSkippedItem = 'variable-referring-to-skipped-item-error',
  VariableReferringToNotExistedItem = 'variable-referring-to-not-existed-item',
}

export const themeParams = {
  ordering: 'name',
};

export const IP_ADDRESS_REGEXP =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const PORT_REGEXP =
  /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
