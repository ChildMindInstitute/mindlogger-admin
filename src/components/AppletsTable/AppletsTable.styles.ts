import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const AppletsTableHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing(2.4)};
`;
