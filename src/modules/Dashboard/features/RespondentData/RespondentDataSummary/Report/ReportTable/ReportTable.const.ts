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

export const rows = [
  {
    date: {
      content: () => '4 Dec 2022',
      value: '4 Dec 2022',
    },
    time: {
      content: () => '16:26',
      value: '16:26',
    },
    response: {
      content: () => 'Your child’s physician may use this information to improve',
      value: 'Your child’s physician may use this information to improve',
    },
  },
  {
    date: {
      content: () => '19 Dec 2022',
      value: '19 Dec 2022',
    },
    time: {
      content: () => '16:02',
      value: '16:02',
    },
    response: {
      content: () => 'If you believe your child has a psychiatric or learning disorder',
      value: 'If you believe your child has a psychiatric or learning disorder',
    },
  },
  {
    date: {
      content: () => '8 Jan 2022',
      value: '8 Jan 2022',
    },
    time: {
      content: () => '15:42',
      value: '15:42',
    },
    response: {
      content: () =>
        'independent committee established to help protect the rights of research subjects here also we can continue this text by texting nothing ',
      value:
        'independent committee established to help protect the rights of research subjects here also we can continue this text by texting nothing ',
    },
  },
];
