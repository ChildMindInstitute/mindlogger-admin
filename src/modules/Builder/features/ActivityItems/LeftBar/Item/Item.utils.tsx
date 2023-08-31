import { Svg } from 'shared/components';

import { ActionsType } from './Item.types';

export const getActions = ({
  onRemoveItem,
  onDuplicateItem,
  onChangeVisibility,
  isItemHidden,
  hasHiddenOption,
  'data-testid': dataTestid,
}: ActionsType) => [
  {
    icon: <Svg id="duplicate" />,
    action: () => onDuplicateItem(),
    'data-testid': `${dataTestid}-duplicate`,
  },
  {
    icon: <Svg id={isItemHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => onChangeVisibility(),
    isStatic: isItemHidden,
    isDisplayed: !hasHiddenOption,
    'data-testid': `${dataTestid}-hide`,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemoveItem,
    'data-testid': `${dataTestid}-remove`,
  },
];
