import { Svg, BuilderItemType } from 'components';
import avatarSrc from 'assets/images/avatar.png';

export const activities: BuilderItemType[] = [
  {
    id: '1',
    name: 'Activity name 1',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
    img: avatarSrc,
    count: 10,
  },
  {
    id: '2',
    name: 'Activity name 1',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
    img: avatarSrc,
    count: 1,
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
