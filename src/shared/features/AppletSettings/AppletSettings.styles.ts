import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import { StyledHeadlineLarge, variables, theme } from 'shared/styles';

export const StyledHeadline = styled(StyledHeadlineLarge)`
  margin-bottom: ${theme.spacing(4.8)};
`;

export const StyledAppletSettingsDescription = styled(Box)`
  max-width: 54.6rem;
  margin-bottom: ${theme.spacing(2.4)};
  color: ${variables.palette.on_surface_variant};

  .MuiTypography-root {
    color: ${variables.palette.on_surface_variant};
  }
`;

export const StyledAppletSettingsButton = styled(Button)`
  width: max-content;
  height: 4.8rem;
  padding: ${theme.spacing(0, 2.5)};
`;
