import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: variables.palette.inverse_surface,
    color: variables.palette.inverse_on_surface,
    textAlign: 'left',
    fontSize: variables.font.size.md,
    maxWidth: theme.spacing(24),
    lineHeight: variables.font.lineHeight.md,
    padding: theme.spacing(0.4, 0.8),
    fontWeight: variables.font.weight.regular,
    letterSpacing: variables.font.letterSpacing.sm,
  },
}));
