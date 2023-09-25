import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledHeadline } from 'shared/styles/styledComponents';

export const StyledConfirmation = styled(Box)`
  width: 47.3rem;
  text-align: center;
  margin-top: ${theme.spacing(3.2)};
  padding: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.xl};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
`;

export const StyledHeader = styled(StyledHeadline)`
  margin: ${theme.spacing(0, 0, 0.8)};
`;
