import { Svg } from 'shared/components/Svg';

import { GetSliderPanelActions } from './Header.types';

export const getActions = ({ onRemove, 'data-testid': dataTestid }: GetSliderPanelActions) => [
  {
    icon: <Svg id="trash" />,
    action: onRemove,
    'data-testid': `${dataTestid}-remove`,
  },
];
