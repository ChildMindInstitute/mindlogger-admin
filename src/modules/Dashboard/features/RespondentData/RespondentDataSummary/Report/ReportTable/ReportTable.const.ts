import i18n from 'i18n';
import { HeadCell } from 'shared/types';

export const getHeadCells = (): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'date',
      label: t('date'),
      enableSort: true,
      width: '15%',
    },
    {
      id: 'time',
      label: t('time'),
      enableSort: true,
      width: '15%',
    },
    {
      id: 'answer',
      label: t('response'),
      enableSort: true,
      width: '70%',
    },
  ];
};
