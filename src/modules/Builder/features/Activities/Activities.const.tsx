import { NavLink } from 'react-router-dom';

import { Svg } from 'shared/components';

type GetActions = {
  key: string;
  isHidden?: boolean;
  onDuplicate: () => void;
  onVisibilityChange: () => void;
  onRemove: () => void;
};

//TODO: add navigate for editing
export const getActions = ({
  key,
  isHidden,
  onDuplicate,
  onVisibilityChange,
  onRemove,
}: GetActions) => [
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
    action: onDuplicate,
    toolTipTitle: '',
  },
  {
    icon: <Svg id={isHidden ? 'visibility-off' : 'visibility-on'} />,
    action: onVisibilityChange,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="trash" />,
    action: onRemove,
    toolTipTitle: '',
  },
];
