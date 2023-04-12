import { Svg } from 'shared/components';
import i18n from 'i18n';

export const getFlowBuilderActions = () => [
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
    icon: <Svg id="trash" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="drag" />,
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
