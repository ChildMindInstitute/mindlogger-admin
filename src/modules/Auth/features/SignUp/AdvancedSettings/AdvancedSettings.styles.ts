import { styled, Box, FormControl, MenuItem } from '@mui/material';

import { StyledClearedButton } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledAdvancedSettings = styled(Box)`
  width: 100%;
  margin-bottom: ${theme.spacing(0.8)};
`;

export const StyledFormControl = styled(FormControl)`
  margin-top: ${theme.spacing(1.6)};
`;

export const StyledMenuItem = styled(MenuItem)`
  white-space: normal;
`;

export const StyledSettingsButton = styled(StyledClearedButton)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.sm};
  letter-spacing: ${variables.font.letterSpacing.xl};
  color: ${variables.palette.black};

  .MuiTouchRipple-root {
    display: none;
  }

  &.MuiButton-text:hover {
    background-color: transparent;
  }
`;
