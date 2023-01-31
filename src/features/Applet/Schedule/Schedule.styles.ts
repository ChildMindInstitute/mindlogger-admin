import { styled, Box } from '@mui/material';

import theme from 'styles/theme';

export const StyledSchedule = styled(Box)`
  margin: ${theme.spacing(-2.4, -2.1, -1.6)};
  display: flex;
  flex-grow: 1;
`;

export const StyledLeftPanel = styled(Box)`
  width: 32rem;
`;
