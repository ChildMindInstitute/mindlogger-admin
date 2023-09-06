import i18n from 'i18n';
import { ItemResponseType } from 'shared/consts';

const { t } = i18n;

export const columns = [
  {
    key: t('name'),
    label: t('itemName'),
  },
  {
    key: t('question'),
    label: t('itemBody'),
    styles: {
      width: '65%',
    },
  },
];

export const ItemTypesToPrint = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Text,
];
