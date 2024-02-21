import { Box, Button, styled } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledAppletSettingsDescription = styled(Box)`
  max-width: 54.6rem;
  margin-bottom: ${theme.spacing(2.4)};
  color: ${variables.palette.on_surface_variant};
  font-weight: ${variables.font.weight.bold};

  .MuiTypography-root {
    color: ${variables.palette.on_surface_variant};
  }
`;

export const StyledAppletSettingsButton = styled(Button)`
  width: max-content;
  height: 4.8rem;
  padding: ${theme.spacing(0, 2.5)};
  margin-top: ${theme.spacing(2.8)};
`;
