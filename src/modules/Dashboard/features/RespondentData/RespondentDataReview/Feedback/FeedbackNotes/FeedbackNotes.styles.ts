import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -0.6)};
  flex-grow: 1;
`;

export const StyledNoteListContainer = styled(Box)`
  padding: ${theme.spacing(2.4, 2)};
  position: relative;
`;
