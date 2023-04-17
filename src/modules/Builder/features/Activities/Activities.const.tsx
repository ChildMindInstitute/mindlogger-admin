import { Svg } from 'shared/components';

type GetActions = {
  key: string;
  isActivityHidden?: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onVisibilityChange: () => void;
  onRemove: () => void;
};

//TODO: add navigate for editing
export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
}: GetActions) => [
  {
    icon: <Svg id="edit" />,
    action: onEdit,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="duplicate" />,
    action: onDuplicate,
    toolTipTitle: '',
  },
  {
    icon: <Svg id={isActivityHidden ? 'visibility-off' : 'visibility-on'} />,
    action: onVisibilityChange,
    toolTipTitle: '',
    isStatic: isActivityHidden,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemove,
    toolTipTitle: '',
  },
];
