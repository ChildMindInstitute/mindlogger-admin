import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  & > *:not(:last-child) {
    margin-bottom: ${theme.spacing(1.6)};
  }
`;
