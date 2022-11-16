import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const AppletsTableHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${theme.spacing(2.4, 0)};
`;

export const StyledButtons = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
