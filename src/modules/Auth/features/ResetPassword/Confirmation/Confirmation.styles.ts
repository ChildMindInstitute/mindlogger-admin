import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledHeadline } from 'shared/styles/styledComponents';

export const StyledConfirmation = styled(Box)`
  text-align: center;
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  background: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xl};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};

  a.here {
    color: ${variables.palette.primary};
  }
`;

export const StyledHeader = styled(StyledHeadline)`
  margin: ${theme.spacing(0, 0, 0.8)};
`;
