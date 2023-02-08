import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import { variables } from 'styles/variables';
import { TooltipUiType } from './Tooltip.types';

export const StyledTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(({ className }) => {
  if (className === TooltipUiType.Secondary) {
    return {
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: variables.palette.inverse_surface,
        textAlign: 'center',
        fontSize: variables.font.size.sm,
      },
    };
  }
});
