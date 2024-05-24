import i18n from 'i18n';
import { HeadCell } from 'shared/types';

export enum RespondentsColumnsWidth {
  Pin = '4.8rem',
  Default = '20rem',
}

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      enableSort: true,
      width: RespondentsColumnsWidth.Pin,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'lastSeen',
      label: t('latestActive'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
            width: RespondentsColumnsWidth.Default,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};
