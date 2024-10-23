import { ItemResponseType } from 'shared/consts';

export const unsupportedResponseTypes = [
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.Unity,
];

export const universalSupportedResponseTypes = [
  ItemResponseType.AudioPlayer,
  ItemResponseType.Date,
  ItemResponseType.Message,
  ItemResponseType.MultipleSelection,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.NumberSelection,
  ItemResponseType.ParagraphText,
  ItemResponseType.SingleSelection,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.Slider,
  ItemResponseType.SliderRows,
  ItemResponseType.Text,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
];

export const mobileSupportedResponseTypes = [
  ItemResponseType.ABTrails,
  ItemResponseType.Audio,
  ItemResponseType.Drawing,
  ItemResponseType.Flanker,
  ItemResponseType.Geolocation,
  ItemResponseType.Photo,
  ItemResponseType.StabilityTracker,
  ItemResponseType.Video,
];

export const webSupportedResponseTypes = [ItemResponseType.PhrasalTemplate];

export const getIsWebSupported = (itemResponseTypes: { responseType: ItemResponseType }[] = []) =>
  itemResponseTypes.every(
    ({ responseType }) =>
      universalSupportedResponseTypes.includes(responseType) ||
      webSupportedResponseTypes.includes(responseType),
  );

export const getIsMobileOnly = (responseType: ItemResponseType) =>
  mobileSupportedResponseTypes.includes(responseType);

export const getIsWebOnly = (responseType: ItemResponseType) =>
  webSupportedResponseTypes.includes(responseType);
