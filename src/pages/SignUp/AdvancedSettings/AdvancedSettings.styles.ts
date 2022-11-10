import { styled } from '@mui/system';
import { Button, Box, FormControl, MenuItem } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledAdvancedSettings = styled(Box)`
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const StyledFormControl = styled(FormControl)`
  margin-top: 1rem;
`;

export const StyledMenuItem = styled(MenuItem)`
  white-space: normal;
`;

export const StyledSettingsButton = styled(Button)`
  width: 100%;
  padding: 0;
  height: auto;
  display: flex;
  justify-content: space-between;
  font-size: ${variables.font.size.sm};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.lineHeight.sm};
  letter-spacing: ${variables.letterSpacing.lg};
  color: ${variables.palette.shades100};

  .MuiTouchRipple-root {
    display: none;
  }

  &:hover {
    background-color: transparent;
  }
`;
