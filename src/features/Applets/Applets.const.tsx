import { t } from 'i18next';
import { NavigateFunction } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { HeadCell } from 'types/table';
import { page } from 'resources';

export const getHeadCells = (): HeadCell[] => [
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
  },
];

export const getMenuItems = (handleMenuClose: () => void, navigate: NavigateFunction) => [
  {
    icon: <Svg id="builder" />,
    title: t('new'),
    action: () => {
      handleMenuClose();
      navigate(page.newApplet);
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
