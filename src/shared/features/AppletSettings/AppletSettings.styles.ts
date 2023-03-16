import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import { StyledHeadlineLarge, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexTopCenter)`
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

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
