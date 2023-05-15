import { Box, ListItem, styled } from '@mui/material';

import theme from 'shared/styles/theme';

export const StyledEmptyItem = styled(ListItem)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 27.5rem;
  text-align: center;
  overflow-wrap: break-word;
`;

export const StyledIcon = styled(Box)`
  margin-bottom: ${theme.spacing(1.6)};
`;
