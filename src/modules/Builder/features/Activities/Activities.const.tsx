import { NavLink } from 'react-router-dom';

import { Svg } from 'shared/components';

//TODO: add navigate for editing
export const getActions = (key: string) => [
  {
    icon: (
      <NavLink to={key}>
        <Svg id="edit" />
      </NavLink>
    ),
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="visibility-on" />,
    action: () => null,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="trash" />,
    action: () => null,
    toolTipTitle: '',
  },
];
