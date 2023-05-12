import { Actions as CommonActions } from 'shared/components';

import { ActionsProps } from './Actions.types';
import { getActions } from './Actions.utils';

export const Actions = ({ name, onAdd, onRemove }: ActionsProps) => (
  <CommonActions
    items={getActions({ onAdd, onRemove })}
    context={name}
    visibleByDefault
    sxProps={{ width: 'unset' }}
  />
);
