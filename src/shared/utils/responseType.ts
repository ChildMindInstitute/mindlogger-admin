import { ItemResponseType } from 'shared/consts';

export const webSupportedResponseTypes = [
  ItemResponseType.Text,
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.NumberSelection,
  ItemResponseType.Message,
  ItemResponseType.Date,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
  ItemResponseType.AudioPlayer,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.SliderRows,
];

export const getIsWebSupported = (itemResponseTypes: { responseType: ItemResponseType }[] = []) =>
  itemResponseTypes.every(({ responseType }) => webSupportedResponseTypes.includes(responseType));
