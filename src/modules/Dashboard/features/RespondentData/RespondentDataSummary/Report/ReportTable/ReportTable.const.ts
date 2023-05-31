import i18n from 'i18n';
import { HeadCell } from 'shared/types';

export const getHeadCells = (): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'date',
      label: t('date'),
      enableSort: true,
    },
    {
      id: 'time',
      label: t('time'),
      enableSort: true,
    },
    {
      id: 'response',
      label: t('response'),
      enableSort: true,
    },
  ];
};
