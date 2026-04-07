import { Box, styled, tooltipClasses, Tooltip, TooltipProps } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledPasswordTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} children={children} />
))(() => ({
  [`&& .${tooltipClasses.tooltip}`]: {
    backgroundColor: variables.palette.white,
    color: variables.palette.on_surface,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    padding: theme.spacing(1.6, 2),
    maxWidth: '26rem',
  },
}));

export const StyledSection = styled(Box)`
  margin-bottom: ${theme.spacing(1.2)};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledSectionTitle = styled('div')`
  font-size: ${variables.font.size.body2};
  font-weight: ${variables.font.weight.bold};
  line-height: ${variables.font.lineHeight.body2};
  color: ${variables.palette.on_surface};
  margin-bottom: ${theme.spacing(0.4)};
`;

export const StyledGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(0.4, 1.6)};
`;

export const StyledRequirement = styled('div')<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.4)};
  font-size: ${variables.font.size.body2};
  line-height: ${variables.font.lineHeight.body2};
  color: ${({ met }) => (met ? variables.palette.green : variables.palette.error60)};
`;

export const StyledInfoIcon = styled('span')`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  && svg {
    fill: ${variables.palette.outline};
    width: 1.8rem;
    height: 1.8rem;
  }
`;
