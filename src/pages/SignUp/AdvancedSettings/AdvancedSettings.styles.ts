import { styled } from '@mui/system';
import { Box, FormControl, MenuItem } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

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
  line-height: ${variables.lineHeight.sm};
  letter-spacing: ${variables.letterSpacing.xl};
  color: ${variables.palette.black};

  .MuiTouchRipple-root {
    display: none;
  }

  &:hover {
    background-color: transparent;
  }
`;
