import { ItemResponseType } from 'shared/consts';

export const SUMMARY_UNSUPPORTED_ITEMS = [
  ItemResponseType.Date,
  ItemResponseType.Audio,
  ItemResponseType.AudioPlayer,
  ItemResponseType.Drawing,
  ItemResponseType.Geolocation,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.TimeRange,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.SliderRows,
  ItemResponseType.NumberSelection,
  ItemResponseType.Message,
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];

export const REVIEW_UNSUPPORTED_ITEMS = [...SUMMARY_UNSUPPORTED_ITEMS, ItemResponseType.Time];
