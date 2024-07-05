import { Svg } from 'shared/components/Svg';

import { ItemFlowActionsType } from './ItemFlowActions.types';

export const getItemFlowActions = ({
  onAdd,
  onDuplicate,
  onRemove,
  'data-testid': dataTestid,
}: ItemFlowActionsType) => [
  {
    icon: <Svg id="add" />,
    action: () => onAdd(),
    'data-testid': `${dataTestid}-add`,
  },
  {
    icon: <Svg id="duplicate" />,
    action: onDuplicate,
    'data-testid': `${dataTestid}-duplicate`,
  },
  {
    icon: <Svg id="trash" />,
    action: () => onRemove(),
    'data-testid': `${dataTestid}-remove`,
  },
];
