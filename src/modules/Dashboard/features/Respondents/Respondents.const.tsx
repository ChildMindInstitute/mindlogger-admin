import i18n from 'i18n';
import { HeadCell } from 'shared/types';

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      enableSort: true,
      width: '4.8rem',
    },
    {
      id: 'secretId',
      label: t('secretUserId'),
      enableSort: true,
    },
    {
      id: 'nickname',
      label: t('nickname'),
      enableSort: true,
    },
    {
      id: 'latestActive',
      label: t('latestActive'),
      enableSort: true,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
            enableSort: true,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};
