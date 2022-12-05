import { TFunction } from 'i18next';

import { Svg } from 'components/Svg';
import { UserData } from 'redux/modules';
import { HeadCell } from 'types/table';

export const getHeadCells = (t: TFunction): HeadCell[] => [
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
    id: 'updated',
    label: t('updated'),
    enableSort: true,
  },
  {
    id: 'actions',
    label: t('actions'),
  },
];

export const actions = [
  {
    icon: <Svg id="user-calendar" width={20} height={21} />,
    action: (item: UserData) => item,
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: (item: UserData) => item,
  },
  {
    icon: <Svg id="export" width={18} height={20} />,
    action: (item: UserData) => item,
  },
  {
    icon: <Svg id="edit-access" width={21} height={19} />,
    action: (item: UserData) => item,
  },
  {
    icon: <Svg id="edit-user" width={21} height={22} />,
    action: (item: UserData) => item,
  },
];
