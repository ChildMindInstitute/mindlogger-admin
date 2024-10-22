import { styled, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  gap: ${theme.spacing(1.2)};
`;

export const StyledToggleButton = styled(ToggleButton)`
  align-items: center;
  gap: ${theme.spacing(0.8)};
  transition: ${variables.transitions.bgColor};
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  letter-spacing: ${variables.font.letterSpacing.sm};

  && {
    color: ${variables.palette.primary};
    padding: ${theme.spacing(1.3, 2.4)};
    border-radius: ${variables.borderRadius.xxxl2} !important;
    border-color: ${variables.palette.outline_variant} !important;
    height: auto;

    &:hover,
    &:not(.Mui-selected):focus {
      background-color: ${variables.palette.primary_alfa8};
    }

    &.Mui-selected {
      border-color: transparent !important;
    }
  }
` as typeof ToggleButton;
