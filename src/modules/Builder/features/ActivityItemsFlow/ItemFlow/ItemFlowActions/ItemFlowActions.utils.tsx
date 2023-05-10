import { Svg } from 'shared/components';

import { ActionsType } from './ItemFlowActions.types';

export const getActions = ({ onAdd, onRemove }: ActionsType) => [
  {
    icon: <Svg id="add" />,
    action: () => onAdd(),
  },
  {
    icon: <Svg id="trash" />,
    action: () => onRemove(),
  },
];
