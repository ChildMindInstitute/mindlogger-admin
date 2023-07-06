import { styled } from '@mui/material';

import { StyledFlexTopCenter, StyledBodyLarge, variables, theme } from 'shared/styles';

export const StyledWrapper = styled(StyledFlexTopCenter)`
  padding-left: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledText = styled(StyledBodyLarge)`
  margin-left: ${theme.spacing(2)};
  color: ${variables.palette.on_surface_variant};
`;
