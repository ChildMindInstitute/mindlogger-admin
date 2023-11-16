import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  position: relative;
  box-sizing: content-box;
  height: 100%;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
  padding: ${theme.spacing(2.4, 2.4, 1.6)};
  overflow-y: auto;

  .spinner-container {
    height: calc(100% - 4.8rem);
    width: calc(100% - 4.8rem);
    background-color: transparent;
  }
`;
