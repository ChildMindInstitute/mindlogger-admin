import { Svg } from 'shared/components';
import i18n from 'i18n';

export const activities = [
  {
    id: '1',
    name: 'Activity name 1',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
  },
  {
    id: '2',
    name: 'Activity name 2',
    description: 'This is the item text the quick brown fox jumps over the lazy dog ',
  },
];

export const getActions = () => [
  {
    icon: <Svg id="replace" />,
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

export const getButtons = () => {
  const { t } = i18n;

  return [
    { label: t('addActivity'), icon: <Svg id="add" width={18} height={18} /> },
    { label: t('clearFlow'), icon: <Svg id="cross" width={18} height={18} /> },
  ];
};
