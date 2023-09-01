import { Svg } from 'shared/components';

import { ActionsType } from './Actions.types';

export const getActions = ({ onAdd, onRemove, 'data-testid': dataTestid }: ActionsType) => [
  {
    icon: <Svg id="add" />,
    action: () => onAdd(),
    'data-testid': `${dataTestid}-add`,
  },
  {
    icon: <Svg id="trash" />,
    action: () => onRemove(),
    'data-testid': `${dataTestid}-remove`,
  },
];
