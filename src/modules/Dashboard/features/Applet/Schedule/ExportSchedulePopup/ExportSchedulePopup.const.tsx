import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';

const { t } = i18n;

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'activityName',
    label: t('activityName'),
  },
  {
    id: 'date',
    label: t('date'),
  },
  {
    id: 'startTime',
    label: t('startTime'),
  },
  {
    id: 'endTime',
    label: t('endTime'),
  },
  {
    id: 'notificationTime',
    label: t('notificationTime'),
  },
  {
    id: 'repeats',
    label: t('repeats'),
  },
  {
    id: 'frequency',
    label: t('frequency'),
  },
];
