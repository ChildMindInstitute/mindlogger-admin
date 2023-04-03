import { Svg } from 'shared/components';

import { ActionsType } from './Item.types';

export const getActions = ({ onRemoveItem, onChangeVisibility }: ActionsType) => [
  {
    icon: <Svg id="duplicate" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="visibility-on" />,
    action: () => onChangeVisibility(),
    toolTipTitle: '',
  },
  {
    icon: <Svg id="trash" />,
    action: onRemoveItem,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="drag" />,
    action: () => null,
    toolTipTitle: '',
  },
];
