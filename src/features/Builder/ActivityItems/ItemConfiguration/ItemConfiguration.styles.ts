import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';

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

export const StyledItemConfigurationWrapper = styled(StyledFlexColumn)`
  margin: ${theme.spacing(2.8, 6.4)};
  overflow-y: auto;
`;
