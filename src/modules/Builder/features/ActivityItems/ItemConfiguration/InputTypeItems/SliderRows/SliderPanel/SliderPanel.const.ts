import i18n from 'i18n';

const { t } = i18n;

export const SLIDER_VALUE_HEAD_ROWS = [
  {
    id: 'placeholder',
    label: t('value'),
  },
];

export const SLIDER_LABEL_ROWS = [
  { placeholder: { content: () => t('score'), value: t('score') } },
];
