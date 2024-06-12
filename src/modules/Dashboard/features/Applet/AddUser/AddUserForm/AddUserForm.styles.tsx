import { styled, Box, Grid } from '@mui/material';

import { variables, theme, StyledClearedButton } from 'shared/styles';

export const StyledRow = styled(Box)`
  display: flex;
  margin-top: ${theme.spacing(2.4)};
`;

export const StyledTooltip = styled(Box)`
  display: flex;
  margin-left: ${theme.spacing(0.6)};

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledGridContainer = styled(Grid)`
  .MuiFormHelperText-root.Mui-error {
    position: static;
    white-space: unset;
  }
`;

export const StyledLinkBtn = styled(StyledClearedButton)`
  color: ${variables.palette.semantic.error};
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.xs};
  letter-spacing: ${variables.font.letterSpacing.sm};
  text-decoration: underline;
  vertical-align: unset;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
