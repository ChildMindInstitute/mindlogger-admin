import { Box, styled } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledCustomCover = styled(Box)`
  height: 3.2rem;
  width: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${variables.borderRadius.xs};
  background-color: ${variables.palette.primary_container};
  margin-right: ${theme.spacing(1.2)};
  text-transform: uppercase;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.xs};
`;
