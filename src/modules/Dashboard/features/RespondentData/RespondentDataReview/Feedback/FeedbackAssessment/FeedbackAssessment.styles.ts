import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledContainer = styled(Box)`
  box-sizing: content-box;
  padding: ${theme.spacing(2.4, 2.4)};
  border-radius: ${variables.borderRadius.lg2};
  background-color: ${variables.palette.surface};

  .spinner-container {
    height: calc(100% - 4.8rem);
    width: calc(100% - 4.8rem);
    background-color: transparent;
  }
`;
