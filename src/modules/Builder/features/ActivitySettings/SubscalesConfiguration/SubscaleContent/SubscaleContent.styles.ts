import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

const columnWidth = 'calc(50% - 1rem)';

export const StyledWrapper = styled(Box)`
  display: grid;
  grid-template-columns: ${columnWidth} ${columnWidth};
  margin-bottom: ${theme.spacing(4.4)};
  gap: ${theme.spacing(2)};
`;
