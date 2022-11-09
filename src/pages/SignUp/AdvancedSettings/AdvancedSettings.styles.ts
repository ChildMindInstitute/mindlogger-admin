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
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0.4px;
  color: ${variables.palette.shades100};

  .MuiTouchRipple-root {
    display: none;
  }

  &:hover {
    background-color: transparent;
  }
`;
