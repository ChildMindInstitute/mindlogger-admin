import { Box, Select, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledVersionHistoryContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const StyledVersionSelect = styled(Select)`
  max-width: 54.6rem;
  width: inherit;
  margin-bottom: ${theme.spacing(2.4)};

  .navigate-arrow {
    pointer-events: none;
    position: absolute;
    right: 1rem;
  }
`;

export const StyledChangesContainer = styled(Box)`
  min-height: 6rem;

  .spinner-container {
    height: calc(100% - 11.6rem);
  }
`;
