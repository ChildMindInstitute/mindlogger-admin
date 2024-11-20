import { ItemResponseType } from 'shared/consts';

export const DisplayMode = {
  SENTENCE: 'sentence',
  BULLET_LIST: 'bullet_list',
  SENTENCE_OPTION_ROW: 'sentence_option_row',
  SENTENCE_ROW_OPTION: 'sentence_row_option',
  BULLET_LIST_OPTION_ROW: 'bullet_list_option_row',
  BULLET_LIST_TEXT_ROW: 'bullet_list_text_row',
} as const;
export type DisplayMode = (typeof DisplayMode)[keyof typeof DisplayMode];

export const DisplayModeOptions: Readonly<Record<ItemResponseType, DisplayMode[] | undefined>> = {
  [ItemResponseType.MultipleSelection]: [DisplayMode.SENTENCE, DisplayMode.BULLET_LIST],
  [ItemResponseType.SingleSelectionPerRow]: [
    DisplayMode.SENTENCE_OPTION_ROW,
    DisplayMode.SENTENCE_ROW_OPTION,
    DisplayMode.BULLET_LIST_OPTION_ROW,
    DisplayMode.BULLET_LIST_TEXT_ROW,
  ],
  [ItemResponseType.MultipleSelectionPerRow]: [
    DisplayMode.SENTENCE_OPTION_ROW,
    DisplayMode.SENTENCE_ROW_OPTION,
    DisplayMode.BULLET_LIST_OPTION_ROW,
    DisplayMode.BULLET_LIST_TEXT_ROW,
  ],
  [ItemResponseType.ABTrails]: undefined,
  [ItemResponseType.Audio]: undefined,
  [ItemResponseType.AudioPlayer]: undefined,
  [ItemResponseType.Date]: undefined,
  [ItemResponseType.Drawing]: undefined,
  [ItemResponseType.Flanker]: undefined,
  [ItemResponseType.Geolocation]: undefined,
  [ItemResponseType.Message]: undefined,
  [ItemResponseType.NumberSelection]: undefined,
  [ItemResponseType.ParagraphText]: undefined,
  [ItemResponseType.Photo]: undefined,
  [ItemResponseType.PhrasalTemplate]: undefined,
  [ItemResponseType.SingleSelection]: undefined,
  [ItemResponseType.Slider]: undefined,
  [ItemResponseType.SliderRows]: undefined,
  [ItemResponseType.StabilityTracker]: undefined,
  [ItemResponseType.Text]: undefined,
  [ItemResponseType.Time]: undefined,
  [ItemResponseType.TimeRange]: undefined,
  [ItemResponseType.TouchPractice]: undefined,
  [ItemResponseType.TouchTest]: undefined,
  [ItemResponseType.Unity]: undefined,
  [ItemResponseType.Video]: undefined,
};

export const KEYWORDS = {
  SENTENCE: 'sentence',
  DISPLAY_SENTENCE: 'sentence',
  ITEM_RESPONSE: 'item_response',
  LINE_BREAK: 'line_break',
} as const;
