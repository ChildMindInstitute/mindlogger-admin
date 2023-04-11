import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
  padding: ${theme.spacing(2.4, 2.4, 1.6)};
  overflow-y: auto;

  & > *:not(:last-child) {
    margin-bottom: ${theme.spacing(1.6)};
  }
`;
