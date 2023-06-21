import { Select, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledVersionSelect = styled(Select)`
  max-width: 54.6rem;
  margin-bottom: ${theme.spacing(2.4)};

  .navigate-arrow {
    pointer-events: none;
    position: absolute;
    right: 1rem;
  }
`;
