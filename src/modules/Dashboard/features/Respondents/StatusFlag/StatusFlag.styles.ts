import { styled, Button, Popover } from '@mui/material';

import { theme, variables, StyledClearedButton } from 'shared/styles';

export const StyledButton = styled(Button)`
  && {
    padding: ${theme.spacing(0.7, 1)};
    color: ${variables.palette.on_surface_variant};
    background-color: ${variables.palette.inverse_on_surface};
    font-size: ${variables.font.size.sm};
    font-weight: ${variables.font.weight.regular};
    border-radius: ${variables.borderRadius.md};
    line-height: ${variables.font.lineHeight.sm};
    letter-spacing: ${variables.font.letterSpacing.xxl};
    height: auto;
    transition: ${variables.transitions.opacity};
    min-width: 8.5rem;

    &.Mui-disabled {
      color: ${variables.palette.on_surface_variant};
      background-color: ${variables.palette.inverse_on_surface};
    }

    &:hover {
      background-color: ${variables.palette.inverse_on_surface};
      opacity: ${variables.opacity.hover};
    }

    &:active,
    &:focus {
      background-color: ${variables.palette.inverse_on_surface};
    }
  }
`;

export const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    width: 24rem;
    margin-top: ${theme.spacing(1)};
    padding: ${theme.spacing(0.8, 1.2)};
    border-radius: ${variables.borderRadius.lg};
    background-color: ${variables.palette.surface};
    box-shadow: ${variables.boxShadow.light2};
  }
`;

export const StyledLinkBtn = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  font-size: ${variables.font.size.lg};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.lg};
  letter-spacing: ${variables.font.letterSpacing.xxl};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
