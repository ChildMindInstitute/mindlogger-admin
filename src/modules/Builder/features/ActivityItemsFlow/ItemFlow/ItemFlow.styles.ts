import { styled, Box } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledTitle = styled(Box)`
  & .MuiBadge-root {
    position: relative;
    top: unset;
    right: unset;
    margin-right: ${theme.spacing(1.2)};
  }
`;
