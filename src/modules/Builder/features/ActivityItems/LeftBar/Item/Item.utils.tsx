import { Svg } from 'shared/components';

import { ActionsType } from './Item.types';

export const getActions = ({
  onRemoveItem,
  onDuplicateItem,
  onChangeVisibility,
  isItemHidden,
}: ActionsType) => [
  {
    icon: <Svg id="duplicate" />,
    action: () => onDuplicateItem(),
  },
  {
    icon: <Svg id={isItemHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => onChangeVisibility(),
    isStatic: isItemHidden,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemoveItem,
  },
];
