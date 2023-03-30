import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  & > *:not(:last-child) {
    margin-bottom: ${theme.spacing(1.6)};
  }
`;
