import { ConditionType, ItemResponseType } from 'shared/consts';
import { CorrectPress } from 'modules/Builder/types';

export const CONDITION_TYPES_TO_HAVE_OPTION_ID = [
  ConditionType.IncludesOption,
  ConditionType.NotIncludesOption,
  ConditionType.EqualToOption,
  ConditionType.NotEqualToOption,
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
