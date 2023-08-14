import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: variables.palette.inverse_surface,
    textAlign: 'left',
    fontSize: variables.font.size.sm,
    maxWidth: '24rem',
  },
}));
