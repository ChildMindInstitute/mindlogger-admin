import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledMark = styled(Box)`
  flex-shrink: 0;
  border-radius: ${variables.borderRadius.half};
  width: 0.6rem;
  height: 0.6rem;
  margin-right: ${theme.spacing(0.5)};
  background-color: ${variables.palette.error};
`;
