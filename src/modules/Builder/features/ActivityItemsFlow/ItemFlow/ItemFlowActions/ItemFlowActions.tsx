import { Actions } from 'shared/components';

import { ItemFlowActionsProps } from './ItemFlowActions.types';
import { getActions } from './ItemFlowActions.utils';

export const ItemFlowActions = ({ name, onAdd, onRemove }: ItemFlowActionsProps) => (
  <Actions items={getActions({ onAdd, onRemove })} context={name} visibleByDefault />
);
