import { v4 } from 'uuid';

import i18n from 'i18n';
import { Item, PhrasalTemplateField, PhrasalTemplateFieldType } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

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
  // ItemResponseType.ABTrails,
  // ItemResponseType.Flanker,
  // ItemResponseType.MultipleSelectionPerRow,
  // ItemResponseType.SingleSelectionPerRow,
  // ItemResponseType.SliderRows,
  // ItemResponseType.StabilityTracker,
  // ItemResponseType.TouchPractice,
  // ItemResponseType.TouchTest,
];

const DEFAULT_PHRASE = {
  image: null,
  fields: [
    { type: 'sentence', text: '' },
    { type: 'itemResponse', id: '', displayMode: '' },
    { type: 'sentence', text: '' },
  ],
};

export const getNewDefaultPhrase = () => ({ ...DEFAULT_PHRASE, id: v4() });

export const getNewDefaultField = (
  type: PhrasalTemplateFieldType = 'sentence',
): PhrasalTemplateField => {
  switch (type) {
    case 'itemResponse':
      return { type, id: '', displayMode: '' };
    case 'lineBreak':
      return { type };
    case 'sentence':
    default:
      return { type: 'sentence', text: '' };
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
    fields[0]?.type === 'sentence' &&
    fields[1]?.type === 'itemResponse' &&
    fields[2]?.type === 'sentence';

  return shouldShowDefaultPlaceholders
    ? [
        i18n.t('phrasalTemplateItem.fieldSentencePlaceholderExample'),
        '',
        i18n.t('phrasalTemplateItem.fieldSentencePlaceholderExampleConclusion'),
      ]
    : [];
};