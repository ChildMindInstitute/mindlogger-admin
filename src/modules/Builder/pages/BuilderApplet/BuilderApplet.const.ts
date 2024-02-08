import * as yup from 'yup';

import { CorrectPress } from 'modules/Builder/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { Condition } from 'shared/state';

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

export const conditionsMatch = yup.string().when('conditions', {
  is: (conditions: Condition[]) => conditions?.length > 0,
  then: schema => schema.required(),
  otherwise: schema => schema,
});

export const themeParams = {
  ordering: 'name',
};
