import { ItemResponseType } from 'shared/consts';

export const DisplayModeOptions: Readonly<
  Record<ItemResponseType, { id: string; name: string }[] | undefined>
> = {
  [ItemResponseType.MultipleSelection]: [
    { id: 'sentence', name: 'Sentence' },
    { id: 'bullet_list', name: 'Bullet List' },
  ],
  [ItemResponseType.SingleSelectionPerRow]: [
    { id: 'sentence_option_row', name: 'Sentence: Option Text, Row Text' },
    { id: 'sentence_row_option', name: 'Sentence: Row Text, Option Text' },
    { id: 'bullet_list_option_row', name: 'Bullet List: Option Text, Row Text' },
    { id: 'bullet_list_text_row', name: 'Bullet List: Row Text, Option Text' },
  ],
  [ItemResponseType.MultipleSelectionPerRow]: [
    { id: 'sentence_option_row', name: 'Sentence: Option Text, Row Text' },
    { id: 'sentence_row_option', name: 'Sentence: Row Text, Option Text' },
    { id: 'bullet_list_option_row', name: 'Bullet List: Option Text, Row Text' },
    { id: 'bullet_list_text_row', name: 'Bullet List: Row Text, Option Text' },
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
  [ItemResponseType.Video]: undefined,
};

export const KEYWORDS = {
  SENTENCE: 'sentence',
  ITEM_RESPONSE: 'item_response',
  LINE_BREAK: 'line_break',
} as const;
