import theme from 'shared/styles/theme';

import { ItemTypeTooltipProps } from './ItemTypeTooltip.types';
import { StyledPopover } from './ItemTypeTooltip.styles';
import { getInputTypeContent } from './ItemTypeTooltip.utils';

export const ItemTypeTooltip = ({ uiType, anchorEl }: ItemTypeTooltipProps) => {
  const open = Boolean(anchorEl);

  return (
    <StyledPopover
      disableRestoreFocus
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          marginLeft: theme.spacing(1.5),
        },
      }}
    >
      {getInputTypeContent()[uiType]}
    </StyledPopover>
  );
};
