import i18n from 'i18n';

const { t } = i18n;

export const getColumns = () => [
  {
    key: 'name',
    label: t('itemName'),
  },
  {
    key: 'question',
    label: t('displayedContent'),
    styles: {
      width: '65%',
    },
  },
];
