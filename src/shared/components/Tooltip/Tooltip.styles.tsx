import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(() => ({
  [`&& .${tooltipClasses.tooltip}`]: {
    backgroundColor: variables.palette.inverse_surface,
    color: variables.palette.inverse_on_surface,
    textAlign: 'left',
    fontSize: variables.font.size.md,
    lineHeight: variables.font.lineHeight.md,
    padding: theme.spacing(0.4, 0.8),
    fontWeight: variables.font.weight.regular,
    letterSpacing: variables.font.letterSpacing.sm,
    overflow: 'hidden',
    maxHeight: '100%',
    margin: 0,
  },
}));
