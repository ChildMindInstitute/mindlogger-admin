import i18n from 'i18n';
import { HeadCell } from 'shared/types';

export const getHeadCells = (): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'date',
      label: t('date'),
      enableSort: false,
    },
    {
      id: 'time',
      label: t('time'),
      enableSort: false,
    },
    {
      id: 'response',
      label: t('response'),
      enableSort: false,
    },
  ];
};
