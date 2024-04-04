import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledContainer = styled(Box)`
  position: relative;
  box-sizing: content-box;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
  padding: ${theme.spacing(2.4, 1.6, 1.6)};
  overflow-y: auto;
  flex-grow: 1;

  & > *:not(:last-child) {
    margin-bottom: ${theme.spacing(1.6)};
  }

  .spinner-container {
    height: calc(100% - 4.8rem);
    width: calc(100% - 4.8rem);
    background-color: transparent;
  }

  .empty-state-container {
    padding: 0;
  }
`;
