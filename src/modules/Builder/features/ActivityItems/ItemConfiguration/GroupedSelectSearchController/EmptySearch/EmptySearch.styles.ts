import { Box, ListItem, styled } from '@mui/material';

import theme from 'shared/styles/theme';

export const StyledEmptyTable = styled(ListItem)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 28rem;
  text-align: center;
`;

export const StyledIcon = styled(Box)`
  margin-bottom: ${theme.spacing(1.6)};
`;
