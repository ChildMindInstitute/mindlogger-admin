import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const ContentContainer = styled(Box)`
  padding: ${theme.spacing(4.8, 6.4)};
  overflow-y: auto;
`;
