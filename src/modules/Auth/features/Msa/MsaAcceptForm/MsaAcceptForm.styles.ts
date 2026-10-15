import { Box, Link, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledMsaLink = styled(Link)`
  color: ${variables.palette.secondary};
`;

export const StyledActions = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing(1.6)};
  margin-top: ${theme.spacing(2.4)};
`;
