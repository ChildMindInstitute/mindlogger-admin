import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

export const StyledTop = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledInputWrapper = styled(Box)`
  width: 58rem;
`;
