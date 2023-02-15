import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const StyledBuilderWrapper = styled(Box)`
  max-width: 136rem;
  width: 100%;
  margin: ${theme.spacing(0.4, 4, 0.8)};
`;
