import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';

export const StyledItemConfiguration = styled(StyledFlexColumn)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: ${theme.spacing(2.8, 6.4)};
`;

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

export const StyledOptionsWrapper = styled(Box)`
  margin: ${theme.spacing(0, 0, 2.4)};
  text-align: center;

  svg {
    fill: ${variables.palette.primary};
  }
`;
