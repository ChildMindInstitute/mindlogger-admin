import { TFunction } from 'i18next';

import { Svg } from 'components/Svg';
import { HeadCell } from 'types/table';

export const getHeadCells = (t: TFunction): HeadCell[] => [
  {
    id: 'name',
    label: t('appletName'),
    enableSort: true,
    width: '30%',
  },
  {
    id: 'updated',
    label: t('lastEdit'),
    enableSort: true,
    width: '15%',
  },
  {
    id: 'actions',
    label: t('actions'),
    align: 'right',
  },
];

export const getMenuItems = (t: TFunction, handleMenuClose: () => void) => [
  {
    icon: <Svg id="builder" />,
    title: t('new'),
    action: () => {
      handleMenuClose();
      console.log('build an applet');
    },
  },
  {
    icon: <Svg id="library" />,
    title: t('fromLibrary'),
    action: () => {
      handleMenuClose();
      console.log('add applet from library');
    },
  },
];
