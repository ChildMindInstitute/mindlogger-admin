import { v4 } from 'uuid';

import i18n from 'i18n';
import {
  Item,
  PhrasalTemplateField,
  PhrasalTemplateFieldType,
  PhrasalTemplateResponseValues,
} from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

import { KEYWORDS } from './PhrasalTemplateField/PhrasalTemplateField.const';

// TODO: M2-7211 — Additional response types to be added with
// additional UI for selecting discrete response values.
const PHRASAL_TEMPLATE_COMPATIBLE_RESPONSE_TYPES = [
  ItemResponseType.Date,
  ItemResponseType.MultipleSelection,
  ItemResponseType.NumberSelection,
  ItemResponseType.SingleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Text,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.SliderRows,
];

const DEFAULT_PHRASE: PhrasalTemplateResponseValues['phrases'][number] = {
  image: null,
  fields: [
    { type: KEYWORDS.SENTENCE, text: '' },
    { type: KEYWORDS.ITEM_RESPONSE, itemName: '', displayMode: KEYWORDS.SENTENCE, itemIndex: 0 },
    { type: KEYWORDS.SENTENCE, text: '' },
  ],
};

export const getNewDefaultPhrase = () => ({ ...DEFAULT_PHRASE, id: v4() });

export const getNewDefaultField = (
  type: PhrasalTemplateFieldType = KEYWORDS.SENTENCE,
): PhrasalTemplateField => {
  switch (type) {
    case KEYWORDS.ITEM_RESPONSE:
      return { type, itemName: '', displayMode: KEYWORDS.SENTENCE, itemIndex: 0 };
    case KEYWORDS.LINE_BREAK:
      return { type };
    case KEYWORDS.SENTENCE:
    default:
      return { type: KEYWORDS.SENTENCE, text: '' };
  }
};

export const getActivityItemsForResponseField = (items: Item[] = [], itemIndex = 0) => {
  const preceedingItems = items
    .slice(0, itemIndex)
    .filter(({ responseType }) =>
      PHRASAL_TEMPLATE_COMPATIBLE_RESPONSE_TYPES.includes(responseType),
    );

  return preceedingItems;
};

export const getFieldPlaceholders = (fields: PhrasalTemplateField[] = []) => {
  const shouldShowDefaultPlaceholders =
    fields.length === 3 &&
    fields[0]?.type === KEYWORDS.SENTENCE &&
    fields[1]?.type === KEYWORDS.ITEM_RESPONSE &&
    fields[2]?.type === KEYWORDS.SENTENCE;

  return shouldShowDefaultPlaceholders
    ? [
        i18n.t('phrasalTemplateItem.fieldSentencePlaceholderExample'),
        '',
        i18n.t('phrasalTemplateItem.fieldSentencePlaceholderExampleConclusion'),
      ]
    : [];
};
