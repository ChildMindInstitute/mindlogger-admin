import i18n from 'i18n';

const { t } = i18n;

export const getColumns = () => [
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
