import { ConditionType, ItemResponseType } from 'shared/consts';

export const CONDITION_TYPES_TO_HAVE_OPTION_ID = [
  ConditionType.IncludesOption,
  ConditionType.NotIncludesOption,
  ConditionType.EqualToOption,
  ConditionType.NotEqualToOption,
];

export const defaultFlankerBtnObj = { name: '', image: '' };

export const RESTRICTED_TYPES_IN_VARIABLES = [
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SliderRows,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.Drawing,
  ItemResponseType.Audio,
  ItemResponseType.Geolocation,
  ItemResponseType.AudioPlayer,
];
