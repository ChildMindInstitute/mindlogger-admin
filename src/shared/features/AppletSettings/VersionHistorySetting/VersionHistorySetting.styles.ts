import { Select, styled } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledVersionSelect = styled(Select)`
  max-width: 54.6rem;
  margin-bottom: ${theme.spacing(2.4)};
  color: ${variables.palette.on_surface_variant};

  .MuiTypography-root {
    color: ${variables.palette.on_surface_variant};
  }
`;
