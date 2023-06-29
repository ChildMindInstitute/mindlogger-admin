import { ConditionType, ItemResponseType } from 'shared/consts';

export const CONDITION_TYPES_TO_HAVE_OPTION_ID = [
  ConditionType.IncludesOption,
  ConditionType.NotIncludesOption,
  ConditionType.EqualToOption,
  ConditionType.NotEqualToOption,
];

export const defaultFlankerBtnObj = { name: '', image: '' };

export const ALLOWED_TYPES_IN_VARIABLES = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Date,
  ItemResponseType.NumberSelection,
  ItemResponseType.TimeRange,
  ItemResponseType.Text,
];

export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
}

export enum GyroscopeItemNames {
  GeneralInstruction = 'Gyroscope_General_instruction',
  PracticeInstruction = 'Gyroscope_Calibration_Practice_instruction',
  TestInstruction = 'Gyroscope_Test_instruction',
  PracticeRound = 'Gyroscope_Calibration_Practice',
  TestRound = 'Gyroscope_Test',
}

export enum TouchItemNames {
  GeneralInstruction = 'Touch_General_instruction',
  PracticeInstruction = 'Touch_Calibration_Practice_instruction',
  TestInstruction = 'Touch_Test_instruction',
  PracticeRound = 'Touch_Calibration_Practice',
  TestRound = 'Touch_Test',
}

export const ordinalStrings = ['First', 'Second', 'Third', 'Fourth'];
