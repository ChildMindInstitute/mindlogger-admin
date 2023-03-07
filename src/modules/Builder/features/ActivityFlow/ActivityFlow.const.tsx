import { Svg } from 'shared/components';

import { ItemType } from '../../components';

export const activityFlows: ItemType[] = [
  {
    id: '1',
    name: 'Activity name 1',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
  },
  {
    id: '2',
    name: 'Activity name 1',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
  },
];

export const getActions = () => [
  {
    icon: <Svg id="edit" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="visibility-on" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="trash" />,
    action: () => null,
    toolTipTitle: '',
  },
];
